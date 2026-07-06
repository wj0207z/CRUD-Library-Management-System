<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Borrowing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BorrowingController extends Controller
{
    public function borrow(Request $request, Book $book)
    {
        //get the current logged in user
        $user = $request->user();

        if ($user->role !== 'student') {
            return response()->json([
                'message' => 'Only students can borrow books.',
            ], 403);
        }

        //prevent borrow when no copies left
        if ($book->available_copies <= 0) {
            return response()->json([
                'message' => 'No copies available for this book.',
            ], 400);
        }

        //checks whether same student borrowed same book and not returned
        $alreadyBorrowed = Borrowing::where('user_id', $user->id)
            ->where('book_id', $book->id)
            ->whereNull('returned_at') //still borrowed, not returned yet
            ->exists();

        //if book borrowed, cannot borrow twice even there is extra copies
        if ($alreadyBorrowed) {
            return response()->json([
                'message' => 'You have already borrowed this book.',
            ], 400);
        }

        //DB::transaction means two actions happen together
        $borrowing = DB::transaction(function () use ($user, $book) {
            //create borrow record
            $borrowing = Borrowing::create([
                'user_id' => $user->id,
                'book_id' => $book->id,
                'borrowed_at' => now(),
            ]);
            
            //decrease the available copies at the same time
            $book->decrement('available_copies');

            return $borrowing;
        });

        return response()->json([
            'message' => 'Book borrowed successfully.',
            'borrowing' => $borrowing,
        ], 201);
    }

    //return flow
    public function returnBook(Request $request, Book $book)
    {
        $user = $request->user();

        if ($user->role !== 'student') {
            return response()->json([
                'message' => 'Only students can return books.',
            ], 403);
        }

        //find active borrowing where same student, same book, and not returned
        $borrowing = Borrowing::where('user_id', $user->id)
            ->where('book_id', $book->id)
            ->whereNull('returned_at')
            ->first();

        if (! $borrowing) {
            return response()->json([
                'message' => 'No active borrowing found for this book.',
            ], 404);
        }

        DB::transaction(function () use ($borrowing, $book) {
            //mark return
            $borrowing->update([
                'returned_at' => now(),
            ]);

            //inrease the copy
            $book->increment('available_copies');
        });

        return response()->json([
            'message' => 'Book returned successfully.',
        ]);
    }
}
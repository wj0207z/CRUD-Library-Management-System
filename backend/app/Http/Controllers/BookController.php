<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Book;
use Illuminate\Support\Facades\Storage;
use App\Models\Borrowing;

class BookController extends Controller
{
    //Means take book from database for futher display
    public function index()
    {
        $books = Book::all()->map(function ($book) {
            return $this->withCoverUrl($book);
        });
    
        return response()->json($books);
    }

    
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'isbn' => 'required|string|max:255|unique:books,isbn',
            'category' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'total_copies' => 'required|integer|min:1',
            'available_copies' => 'required|integer|min:0',
            'cover_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($request->hasFile('cover_image')) {
            $validated['cover_image'] = $request
                ->file('cover_image')
                ->store('book-covers', 'public');
        }

        $book = Book::create($validated);

        //201 is a HTTP status code means created
        //200 means ok but 201 means like success
        return response()->json($this->withCoverUrl($book), 201);    }

    
    
    public function show(Request $request, Book $book)
    {
        $book = $this->withCoverUrl($book);
        
        $book->is_borrowed_by_current_user = false;
        
        if ($request->user()) {
            $book->is_borrowed_by_current_user = Borrowing::where('user_id', $request->user()->id)
                ->where('book_id', $book->id)
                ->whereNull('returned_at')
                ->exists();
        }
        
        return response()->json($book);
    }

    
    
    public function update (Request $request, Book $book)
    {

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'isbn' => 'required|string|max:255|unique:books,isbn,' . $book->id, //every book is unique
            'category' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'total_copies' => 'required|integer|min:1',
            'available_copies' => 'required|integer|min:0',
            'cover_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($request->hasFile('cover_image')) {
            if ($book->cover_image) {
                Storage::disk('public')->delete($book->cover_image);
            }
        
        $validated['cover_image'] = $request->file('cover_image')->store('book-covers', 'public');
        }

        $book->update($validated);

        $book->cover_image_url = $book->cover_image
            ? asset('storage/' . $book->cover_image)
            : null;
                
        return response()->json($this->withCoverUrl($book));
    }

    
    
    public function destroy(Book $book)
    {
        $book->delete();

        return response()->json([
            'message' => 'Book deleted successfully',
        ]);
    }

    
    
    private function withCoverUrl(Book $book)
    {
        $book->cover_image_url = $book->cover_image
            ? asset('storage/' . $book->cover_image)
            : null;

        return $book;
    }
}

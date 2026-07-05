<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Book;

class Borrowing extends Model
{
    protected $fillable = [
        'user_id',
        'book_id',
        'borrowed_at',
        'returned_at',
    ];

    public function user()
    {
        //each borrowing records belongs to one user
        return $this->belongsTo(User::class);
    }

    public function book()
    {
        //each borrowing record belongs to one book
        return $this->belongsTo(Book::class);
    }
}
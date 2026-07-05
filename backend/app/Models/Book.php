<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    protected $fillable = [
        'title',
        'author',
        'isbn',
        'category',
        'description',
        'cover_image',
        'total_copies',
        'available_copies',
    ];
}

## Borrow and Return Functionality

The borrow and return feature allows students to borrow books and return them later.

This feature uses three main tables:

```text
users
books
borrowings
```

## Database Design

### users table

Stores user information.

Important fields:

```text
id
name
email
role
```

Example:

```text
id = 2
name = Student
role = student
```

### books table

Stores book information.

Important fields:

```text
id
title
total_copies
available_copies
```

Example:

```text
id = 1
title = Clean Code
total_copies = 3
available_copies = 3
```

### borrowings table

Stores borrowing records.

Important fields:

```text
id
user_id
book_id
borrowed_at
returned_at
```

Example:

```text
id = 1
user_id = 2
book_id = 1
borrowed_at = 2026-07-06 10:00:00
returned_at = null
```

This means:

```text
User 2 borrowed Book 1 and has not returned it yet.
```

## Why Borrowings Table Is Needed

The `books` table only stores book details and copy quantity.

It does not know:

```text
who borrowed the book
when they borrowed it
whether they returned it
```

So the `borrowings` table is used to record borrowing activity.

Each row in `borrowings` means:

```text
One student borrowed one book
```

## Relationship Between Tables

```text
users.id  -> borrowings.user_id
books.id  -> borrowings.book_id
```

Meaning:

```text
One user can have many borrowings.
One book can have many borrowings.
One borrowing belongs to one user.
One borrowing belongs to one book.
```

## Laravel Model Relationships

### User.php

```php
public function borrowings()
{
    return $this->hasMany(Borrowing::class);
}
```

Meaning:

```text
One user can have many borrowing records.
```

### Book.php

```php
public function borrowings()
{
    return $this->hasMany(Borrowing::class);
}
```

Meaning:

```text
One book can have many borrowing records.
```

### Borrowing.php

```php
public function user()
{
    return $this->belongsTo(User::class);
}
```

Relationship Diagram

users
  id
  name
  role
   |
   | one user has many borrowings
   v
borrowings
  id
  user_id
  book_id
  borrowed_at
  returned_at
   ^
   | one book has many borrowings
   |
books
  id
  title
  total_copies
  available_copies
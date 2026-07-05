
# Library Managament System v1
-backend (Laravel)
-frontend (React)

Backend
-handles database, API, authentication, validation, and permissions

Frontend
-handles pages, forms, buttons, layout, user interaction

Database = MySQL
-users
-books
-personal_access_tokens (used by Laravel Sanctum for API login tokens)


User Roles
-admin
-student
-guest

Admin
-add book
-edit book
-delete book
-upload book cover image

student, guest (v1)
-view books


Authentication
-use Laravel Sanctum
-able to login/register

Register Flow:                                          Login Flow:
React register form                                     React login form
        ↓                                                       ↓
POST /api/register                                      POST /api/login
        ↓                                                       ↓
Laravel creates user                                    Laravel creates user
        ↓                                                       ↓
Laravel returns token + user                            Laravel returns token + user
        ↓                                                       ↓
React stores token/user in localStorage                 React stores token/user in localStorage

The token is stored as protected routes need proof that user is logged in
localStorage.setItem("token", response.data.token);
localStorage.setItem("user", JSON.stringify(response.data.user));


Axios API file
-to make HTTP request from browser (React) to backend server (Laravel API)
-its like a delivery man
-avoid repeating the API URL everywhere

BaseURL: "http://localhost:8000/api"

Token Interceptor:
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

This means every time React sends an API request, if token exists, attach it automatically
So admin requests like add/edit/delete can pass Laravel auth.


Routes
-public routes
-protected routes

Public:
Route::get('/books', [BookController::class, 'index']);
Route::get('/books/{book}', [BookController::class, 'show']);

Guest, student and admin can all view books

Private:
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::post('/books', [BookController::class, 'store']);
    Route::put('/books/{book}', [BookController::class, 'update']);
    Route::delete('/books/{book}', [BookController::class, 'destroy']);
});

Need authentication before doing anything

Role Middleware
-check if logged-in user's role matches required role
-example admin role can enter certain group route to carry out some functionalities
-if a student tries to delete a book, 403 unauthorized will show


Book Table
-title
-author
-isbn
-category
-description
-cover_image
-total_copies
-available_copies


Book Model
-has $fillable to protect the model from mass assignment.
-Laravel needs to know which columns are allowed.
-If no, Laravel may refuse to save fields

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


Book Controller
-handles book API logic
-index, show, store, update, destroy

Cover Image Upload
-React cannot send images files as normal JSON
-Uses FormData then
data.append("cover_image", coverImage);

Laravel receives and store using:
$request->hasFile('cover_image')
$request->file('cover_image')->store('book-covers', 'public');

Stored in:
storage/app/public/book-covers

Laravel adds
cover_image_url

by using
asset('storage/' . $book->cover_image)

Because React needs full URL
book.cover_image_url
http://localhost:8000/storage/book-covers/image.jpg


React Pages
-Login.jsx
-Register.jsx
-Books.jsx
-BookDetail.jsx
-AddBook.jsx
-EditBook.jsx
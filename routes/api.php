<?php

use App\Http\Controllers\Api\LoginController;
use App\Http\Controllers\Api\RegistrationController;
// use App\Http\Controllers\Api\TagController;
use App\Http\Controllers\Api\UploadController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('upload', [UploadController::class, 'store']);
Route::post('register', [RegistrationController::class, 'store']);
Route::post('login', [LoginController::class, 'store']);
Route::post('logout', [LoginController::class, 'logout'])->middleware('auth:sanctum');


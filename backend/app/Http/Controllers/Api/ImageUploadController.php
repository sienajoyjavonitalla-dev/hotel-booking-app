<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageUploadController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120', // 5MB max
            'type' => 'required|in:hotel,room', // Type of image (hotel or room)
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $type = $request->input('type', 'hotel');
            
            // Generate unique filename
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            
            // Store in appropriate directory
            $path = $file->storeAs("public/images/{$type}s", $filename);
            
            // Get public URL
            $url = Storage::url($path);
            
            return response()->json([
                'url' => $url,
                'path' => $path,
                'filename' => $filename,
            ], 201);
        }

        return response()->json(['error' => 'No image file provided'], 400);
    }

    public function delete(Request $request)
    {
        $request->validate([
            'path' => 'required|string',
        ]);

        if (Storage::exists($request->path)) {
            Storage::delete($request->path);
            return response()->json(['message' => 'Image deleted successfully']);
        }

        return response()->json(['error' => 'Image not found'], 404);
    }
}

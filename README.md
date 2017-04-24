# nova
Collaborative canvas built for the Meteor Global Distributed Hackathon

## Running

1. Create a cloudinary account with an unsigned upload preset: [Directions](http://cloudinary.com/blog/direct_upload_made_easy_from_browser_or_mobile_app_to_the_cloud)
2. Create a settings.json file:
```
{
  "public": {
    "cloudinary_cloud_name": "YOUR_CLOUDINARY_CLOUD_NAME", 
    "cloudinary_upload_preset": "YOUR_CLOUDINARY_UPLOAD_PRESET"
  }
}
```
3. Run `meteor --settings settings.config`

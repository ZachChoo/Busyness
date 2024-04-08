# Backend Server
Allows the frontend to interface with the database.

### API Endpoints
Those marked with *protected* require a valid jwt as the Bearer token in the Authorization header.
##### Building Related
- `GET /api/get_building`
    - Gets buildings with the specified `id`
- `GET /api/get_all_buildings`
    - Gets all buildings
- `POST /api/create_building` *protected*
    - Creates a building with a `name` and `image`
- `PUT /api/update_building` *protected*
    - Updates a building's `name` or `image` or both
    - Uses `id` to specify building
- `DELETE /api/delete_building` *protected*
    - Deletes a building specified by `id`
    - Deletes all rooms and `PastBusyness` of rooms in the building

##### Room Related
- `GET /api/get_room`
    - Gets room specified by a building's `id` and a `roomid`
- `GET /api/get_all_rooms`
    - Gets all rooms in a building specified by `id`
- `GET /api/get_all_rooms_in_all_buildings`
    - Gets all rooms in all buildings
- `PUT /api/create_room` *protected*
    - Creates a room given a building's `id`, then a `roomName`, `closingTime`, `deviceCount`, and `maxCapacity`
    - Can optionally include a `date`, but if not included date is taken by `Date.now()`
    - Automatically creates a `PastBusyness` entry
- `PUT /api/update_room`
    - Updates room specified by a building's `id` and a `roomid`
    - Can update any combonation of `roomName`, `closingTime`, `deviceCount`, and `maxCapacity`
    - `PastBusyness` entry only created if `deviceCount` or `maxCapacity` are updated
    - Can be either json or x-www-form-urlencoded
- `DELETE /api/delete_room` *protected*
    - Deletes room specified by a building's `id` and a `roomid`
    - Deletes `PastBusyness` associated with the room

##### PastBusyness Related
- `GET /api/get_past_busyness_of_room`
    - Gets all `PastBusyness` entries for the room specified by `roomid`
- `GET /api/get_past_busyness`
    - Gets all `PastBusyness` entries

##### Authentication Related
- `GET /api/is_authenticated`
    - Endpoint just tells us if our jwt is valid
- `POST /api/get_token`
    - Provided with the right password, we get a jwt token in response.

### To run locally
1. First install dependencies by running `npm install`.
2. Make sure you have a Mongodb server running, and put its url in the `.env` file.
3. Run `npm start`.

### To deploy to Google Cloud Platform
1. Install the Google Cloud CLI: https://cloud.google.com/sdk/docs/install-sdk
2. Deploy with `gcloud app deploy`

### Other notes
You'll also find a [Postman](https://www.postman.com/) collection in this directory ([here](busyness.postman_collection.json)) to help get a sense of the endpoints.
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const centerDefault = {
  lat: 44.4268,
  lng: 26.1025,
};

const MapPage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState(null);
  const [restaurantName, setRestaurantName] = useState("");
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [showMap, setShowMap] = useState(false);
  const addressRef = useRef();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const geocodeAddress = async () => {
    const address = addressRef.current.value;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK") {
        const loc = results[0].geometry.location;
        setLocation({ lat: loc.lat(), lng: loc.lng() });

        console.log("Geocoding result:", results[0]);

        const components = results[0].address_components;
        
            // Caută numele restaurantului din componenta de tip "establishment"
        const nameComponent = components.find(comp =>
            comp.types.includes("establishment")
        );

        const name = nameComponent
            ? nameComponent.long_name
            : results[0].formatted_address;

        setRestaurantName(name);
        setShowMap(true);
      } else {
        alert("Geocoding failed: " + status);
      }
    });
  };

  const submitReview = async () => {
    if (!user || !restaurantName || !comment || !location) return;

    const review = {
      restaurantName,
      lat: location.lat,
      lng: location.lng,
      reviewerId: user._id,
      score: rating,
      comment,
    };

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review),
      });

      if (res.ok) {
        alert("Review submitted!");
        setComment("");
        setLocation(null);
        setRestaurantName("");
        setShowMap(false);
        addressRef.current.value = "";
      } else {
        alert("Failed to submit review.");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting review.");
    }
  };

  return (
    <div className="relative bg-beige min-h-screen pb-24">
      {/* Header */}
      <div className="relative h-96 overflow-hidden">
        <img className="absolute inset-0 w-full h-full object-cover" src="/cooking.jpg" alt="Cooking Background" />
        <div className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold tracking-tight text-center">
          Friends on the Map
        </div>
      </div>

      {/* Main content: form + map */}
      <div className="flex flex-col lg:flex-row p-4 gap-4">
        {/* Form */}
        <div className="lg:w-1/2 bg-white border border-gray-300 rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Have you tried a new restaurant? Tell your friends about it.
          </h2>
          <input
            type="text"
            ref={addressRef}
            placeholder="Type a restaurant address..."
            className="w-full border p-2 rounded mb-4"
          />
          <button
            onClick={geocodeAddress}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Pin a new Restaurant Visit
          </button>

          {restaurantName && (
            <p className="mt-4 text-green-700 font-semibold">
              You have been at: <span className="italic">{restaurantName}</span>
            </p>
          )}

          {location && (
            <>
              <div className="mt-4">
                <label className="block">Rate this place:</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="border p-2 rounded w-full"
                >
                  {[1, 2, 3, 4, 5].map((val) => (
                    <option key={val} value={val}>
                      {val} Star{val > 1 && "s"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-4">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  maxLength={100}
                  placeholder="Write a short review (max 100 chars)"
                  className="w-full border p-2 rounded"
                />
              </div>

              <button
                onClick={submitReview}
                className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Submit Review
              </button>
            </>
          )}
        </div>

        {/* Map */}
        {isLoaded && showMap && (
          <div className="lg:w-1/2 h-96 border border-gray-300 rounded-lg overflow-hidden">
            <GoogleMap mapContainerStyle={containerStyle} center={location || centerDefault} zoom={14}>
              {location && (
                <Marker
                  position={location}
                  label={{
                    text: restaurantName,
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                />
              )}
            </GoogleMap>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white flex justify-around py-3 border-t border-gray-700 z-50">
        <button onClick={() => router.push("/profile")} className="flex items-center gap-2 text-sm hover:text-yellow-400">
          <img src="/profile_icon.jpg" alt="Profile" className="w-5 h-5 rounded-full" />Profile
        </button>
        <button onClick={() => router.push("/feed")} className="flex items-center gap-2 text-sm hover:text-yellow-400">
          <img src="/feed_icon.png" alt="Feed" className="w-5 h-5 rounded-full" />Feed
        </button>
        <button onClick={() => router.push("/requests")} className="flex items-center gap-2 text-sm hover:text-yellow-400">
          <img src="/request_icon.jpg" alt="Requests" className="w-5 h-5 rounded-full" />Requests
        </button>
        <button onClick={() => router.push("/main")} className="flex items-center gap-2 text-sm hover:text-yellow-400">
          <img src="/recipie_icon.jpg" alt="Recipies" className="w-5 h-5 rounded-full" />Recipies
        </button>
      </div>
    </div>
  );
};

export default MapPage;

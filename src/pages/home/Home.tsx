import { useEffect, useState } from "react";
import Card from "../../components/ui/Card";
import { Restaurant, Filter, PriceRange } from "../../types/index.ts";

const Home = () => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
    const [filters, setFilters] = useState<Filter[]>([]);
    const [priceRanges, setPriceRanges] = useState<PriceRange[]>([]);
    const [deliveryTimes, setDeliveryTimes] = useState<number[]>([]);
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
    const [selectedDeliveryTimes, setSelectedDeliveryTimes] = useState<number[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPriceRange();
        fetchRestaurants();
        fetchFilters();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [selectedFilters, selectedPriceRanges, selectedDeliveryTimes, restaurants]);

    const fetchRestaurants = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/restaurants`);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const result = await response.json();
            setRestaurants(result.restaurants);
    
            // Fetch the open status for each restaurant using `result.restaurants` directly
            const restaurantsWithStatus = await Promise.all(
                result.restaurants.map(async (restaurant: Restaurant) => {
                    try {
                        console.log("id", restaurant);
    
                        const statusResponse = await fetch(
                            `${import.meta.env.VITE_BACKEND_BASE_URL}/api/open/${restaurant.id}`
                        );
    
                        console.log("statusResponse", statusResponse);
    
                        if (!statusResponse.ok) {
                            throw new Error(`Error fetching status for restaurant ID ${restaurant.id}`);
                        }
                        const { is_open } = await statusResponse.json();
                        return { ...restaurant, is_open }; // Add open_status to restaurant object
                    } catch (error) {
                        console.error(`Failed to fetch open status for ${restaurant.id}:`, error);
                        return { ...restaurant, is_open: "unknown" }; // Handle error gracefully
                    }
                })
            );
    
            console.log("restaurantsWithStatus", restaurantsWithStatus);
    
            // Extract unique delivery times
            const uniqueTimes = Array.from(
                new Set<number>(
                    result.restaurants.map((restaurant: Restaurant) => restaurant.delivery_time_minutes)
                )
            ).sort((a, b) => a - b);
            setDeliveryTimes(uniqueTimes);
    
            setFilteredRestaurants(restaurantsWithStatus); // Update filtered restaurants with status
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };
    

    const fetchFilters = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/filter`);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const result = await response.json();
            setFilters(result.filters);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred");
        }
    };

    const fetchPriceRange = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/price-range`);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const result = await response.json();
            setPriceRanges(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred");
        }
    };

    const applyFilters = () => {
        let filtered = restaurants;

        // Apply filter by categories
        if (selectedFilters.length > 0) {
            filtered = filtered.filter((restaurant) =>
                restaurant.filter_ids.some((filterId) => selectedFilters.includes(filterId))
            );
        }

        // Apply filter by price range
        if (selectedPriceRanges.length > 0) {
            filtered = filtered.filter((restaurant) =>
                selectedPriceRanges.includes(restaurant.price_range_id)
            );
        }

        // Apply filter by delivery time
        if (selectedDeliveryTimes.length > 0) {
            filtered = filtered.filter((restaurant) =>
                selectedDeliveryTimes.includes(restaurant.delivery_time_minutes)
            );
        }

        setFilteredRestaurants(filtered);
    };

    const toggleFilter = (filterId: string) => {
        setSelectedFilters((prev) =>
            prev.includes(filterId)
                ? prev.filter((id) => id !== filterId) // Remove if already selected
                : [...prev, filterId] // Add if not selected
        );
    };

    const togglePriceRange = (priceRangeId: string) => {
        setSelectedPriceRanges((prev) =>
            prev.includes(priceRangeId)
                ? prev.filter((id) => id !== priceRangeId) // Remove if already selected
                : [...prev, priceRangeId] // Add if not selected
        );
    };

    const toggleDeliveryTime = (deliveryTime: number) => {
        setSelectedDeliveryTimes((prevSelected) =>
            prevSelected.includes(deliveryTime)
                ? prevSelected.filter((time) => time !== deliveryTime) // Deselect
                : [...prevSelected, deliveryTime] // Select
        );
    };

    const Loader = () => (
        <div>
            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24"></svg>
            Loading...
        </div>
    );

    if (error) return <p>Error: {error}</p>;

    return (
        <div className="min-h-screen bg-white">
            <header className="mb-10">
                <img className="" src="logo_dark.svg" alt="icons" />
            </header>

            {!loading ? (
                <div className="flex">
                    <aside className="p-6 bg-white border border-gray-200 rounded-lg w-64 hidden md:block mr-4">
                        <div className="mb-6">Filter</div>
                        <div className="mb-6 uppercase text-slate-300">Food Category</div>
                        <div className="mb-4">
                            {filters.map((filter) => (
                                <button
                                    key={filter.id}
                                    className={`inline-flex items-center w-fit h-fit p-2 mr-2 mb-2 gap-2 rounded-[8px] border-[0.6px] ${selectedFilters.includes(filter.id) ? "bg-gray-300" : ""
                                        }`}
                                    onClick={() => toggleFilter(filter.id)}
                                >
                                    <span className="text-sm font-medium text-gray-800">{filter.name}</span>
                                </button>
                            ))}
                        </div>

                        {/* Delivery Time */}
                        <div className="mb-6 uppercase text-slate-300">Delivery Time</div>
                        <div className="mb-4">
                            {deliveryTimes.map((deliveryTime) => (
                                <button
                                    key={deliveryTime}
                                    className={`inline-flex items-center w-fit h-fit p-2 mr-2 mb-2 gap-2 rounded-[8px] border-[0.6px] ${selectedDeliveryTimes.includes(deliveryTime) ? "bg-gray-300" : ""}`}
                                    onClick={() => toggleDeliveryTime(deliveryTime)}
                                >
                                    <span className="text-sm font-medium text-gray-800">{deliveryTime} mins</span>
                                </button>
                            ))}
                        </div>

                        <div className="mb-6 uppercase text-slate-300">Price Range</div>
                        <div className="mb-4">
                            {priceRanges.map((priceRange) => (
                                <button
                                    key={priceRange.id}
                                    className={`inline-flex items-center w-fit h-fit p-2 mr-2 mb-2 gap-2 rounded-[8px] border-[0.6px] ${selectedPriceRanges.includes(priceRange.id) ? "bg-gray-300" : ""
                                        }`}
                                    onClick={() => togglePriceRange(priceRange.id)}
                                >
                                    <span className="text-sm font-medium text-gray-800">{priceRange.range}</span>
                                </button>
                            ))}
                        </div>
                    </aside>

                    <div className="flex-1">
                        <div className="flex mb-2">
                            {
                                filters.map((filter) => (
                                    <button key={filter.id} onClick={() => toggleFilter(filter.id)} className={`flex border border-gray-200 rounded-lg pt-2 pb-4 pl-2 mr-2 w-[160px] h-[80px] ${selectedFilters.includes(filter.id) ? "bg-gray-300" : "bg-white"
                                        }`}>
                                        <div className="text-sm font-medium text-gray-700">
                                            {filter.name}
                                        </div>
                                        <img
                                            className="ml-auto w-[80px] h-[80px] object-contain"
                                            src={`${import.meta.env.VITE_BACKEND_BASE_URL}${filter.image_url}`}
                                            alt="icons"
                                        />
                                    </button>
                                ))
                            }

                        </div>
                        <div className="mt-4 mb-2">
                            <h2 className="text-[2rem]">Restaurants</h2>
                        </div>

                        <div className="flex flex-wrap">
                            {filteredRestaurants.length > 0 ? (
                                filteredRestaurants.map((restaurant) => (
                                    <Card
                                        key={restaurant.id}
                                        name={restaurant.name}
                                        status={restaurant.is_open}
                                        deliveryTime={restaurant.delivery_time_minutes}
                                        image={restaurant.image_url}
                                    />
                                ))
                            ) : (
                                <p>No restaurants available.</p>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <Loader />
            )}
        </div>
    );
};

export default Home;

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

            const restaurantsWithStatus = await Promise.all(
                result.restaurants.map(async (restaurant: Restaurant) => {
                    try {
                        const statusResponse = await fetch(
                            `${import.meta.env.VITE_BACKEND_BASE_URL}/api/open/${restaurant.id}`
                        );

                        if (!statusResponse.ok) {
                            throw new Error(`Error fetching status for restaurant ${restaurant.id}`);
                        }
                        const { is_open } = await statusResponse.json();
                        return { ...restaurant, is_open };
                    } catch (error) {
                        console.error(`Failed to fetch open status for ${restaurant.id}:`, error);
                        return { ...restaurant, is_open: "unknown" };
                    }
                })
            );
            const uniqueTimes = Array.from(
                new Set<number>(
                    result.restaurants.map((restaurant: Restaurant) => restaurant.delivery_time_minutes)
                )
            ).sort((a, b) => a - b);
            setDeliveryTimes(uniqueTimes);
            setFilteredRestaurants(restaurantsWithStatus);
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
        if (selectedFilters.length > 0) {
            filtered = filtered.filter((restaurant) =>
                restaurant.filter_ids.some((filterId) => selectedFilters.includes(filterId))
            );
        }

        if (selectedPriceRanges.length > 0) {
            filtered = filtered.filter((restaurant) =>
                selectedPriceRanges.includes(restaurant.price_range_id)
            );
        }

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
                ? prev.filter((id) => id !== filterId)
                : [...prev, filterId]
        );
    };

    const togglePriceRange = (priceRangeId: string) => {
        setSelectedPriceRanges((prev) =>
            prev.includes(priceRangeId)
                ? prev.filter((id) => id !== priceRangeId)
                : [...prev, priceRangeId]
        );
    };

    const toggleDeliveryTime = (deliveryTime: number) => {
        setSelectedDeliveryTimes((prevSelected) =>
            prevSelected.includes(deliveryTime)
                ? prevSelected.filter((time) => time !== deliveryTime)
                : [...prevSelected, deliveryTime]
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
        <div className="container mx-auto p-4">
            <header className="mb-10 flex">
                <img className="w-32 sm:w-auto" src="logo_dark.svg" alt="icons" />
            </header>

            {!loading ? (
                <div className="flex flex-col md:flex-row">
                    <aside className="p-6 bg-white border h-auto md:min-h-[764px] md:w-[239px] border-stroke rounded-lg hidden md:block md:mr-4">
                        <div className="mb-6 text-lg">Filter</div>
                        <div className="mb-6 text-xs uppercase text-stroke">Food Category</div>
                        <div className="mb-4">
                            {filters.map((filter) => (
                                <button
                                    key={filter.id}
                                    className={`inline-flex items-center w-fit h-fit p-2 mr-2 mb-2 gap-2 rounded-[8px] border border-stroke ${selectedFilters.includes(filter.id) ? "bg-[#b8b8b8]" : "bg-white"
                                        }`}
                                    onClick={() => toggleFilter(filter.id)}
                                >
                                    <span className="text-sm font-medium text-gray-800">{filter.name}</span>
                                </button>
                            ))}
                        </div>

                        <div className="mb-6 text-xs uppercase text-stroke">Delivery Time</div>
                        <div className="mb-4">
                            {deliveryTimes.map((deliveryTime) => (
                                <button
                                    key={deliveryTime}
                                    className={`inline-flex items-center w-fit h-fit p-2 mr-2 mb-2 gap-2 rounded-[8px] border border-stroke ${selectedDeliveryTimes.includes(deliveryTime) ? "bg-[#b8b8b8]" : "bg-white"}`}
                                    onClick={() => toggleDeliveryTime(deliveryTime)}
                                >
                                    <span className="text-sm font-medium text-gray-800">{deliveryTime} mins</span>
                                </button>
                            ))}
                        </div>

                        <div className="mb-6 text-xs uppercase text-stroke">Price Range</div>
                        <div className="mb-4">
                            {priceRanges.map((priceRange) => (
                                <button
                                    key={priceRange.id}
                                    className={`inline-flex items-center w-fit h-fit p-2 mr-2 mb-2 gap-2 rounded-[8px] border border-stroke ${selectedPriceRanges.includes(priceRange.id) ? "bg-[#b8b8b8]" : "bg-white"
                                        }`}
                                    onClick={() => togglePriceRange(priceRange.id)}
                                >
                                    <span className="text-sm font-medium text-gray-800">{priceRange.range}</span>
                                </button>
                            ))}
                        </div>
                    </aside>

                    <div className="flex-1">
                        <div className="md:hidden">
                            <div className="mb-6 text-xs uppercase text-stroke">Delivery Time</div>
                            <div className="mb-4">
                                {deliveryTimes.map((deliveryTime) => (
                                    <button
                                        key={deliveryTime}
                                        className={`inline-flex items-center w-fit h-fit p-2 mr-2 mb-2 gap-2 rounded-[8px] border border-stroke ${selectedDeliveryTimes.includes(deliveryTime) ? "bg-[#b8b8b8]" : "bg-white"}`}
                                        onClick={() => toggleDeliveryTime(deliveryTime)}
                                    >
                                        <span className="text-sm font-medium text-gray-800">{deliveryTime} mins</span>
                                    </button>
                                ))}
                            </div>
                        </div>


                        <div className="flex justify-start mb-4 overflow-x-auto space-x-2">
                            {filters.map((filter) => (
                                <button
                                    key={filter.id}
                                    onClick={() => toggleFilter(filter.id)}
                                    className={`flex border border-stroke rounded-lg pt-2 pb-4 pl-2 w-[160px] h-[80px] flex-shrink-0 ${selectedFilters.includes(filter.id) ? "bg-[#b8b8b8]" : "bg-white"}`}
                                >
                                    <div className="text-sm">{filter.name}</div>
                                    <img
                                        className="ml-auto w-[80px] h-[80px] object-contain"
                                        src={`${import.meta.env.VITE_BACKEND_BASE_URL}${filter.image_url}`}
                                        alt="icons"
                                    />
                                </button>
                            ))}
                        </div>

                        <div className="my-8 md:my-14">
                            <h2 className="text-lg md:text-xl">Restaurants</h2>
                        </div>

                        <div className="flex flex-wrap overflow-y-auto max-h-[calc(100vh-200px)] md:max-h-screen">
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
                <div className="flex items-center justify-center h-[calc(100vh-20px)]">
                    <Loader />
                </div>
            )}
        </div>
    );
};

export default Home;

import { useEffect, useState } from "react";
import Card from "../../components/ui/Card";
import { Categories } from '../../utils/data.ts';

type Restaurant = {
    id: string;
    name: string;
    rating: number;
    filter_ids: string[];
    image_url: string;
    delivery_time_minutes: number;
    price_range_id: string;
};

type Filter = {
    id: string;
    name: string;
    image_url: string;
};

const Home = () => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [filters, setFilters] = useState<Filter[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchRestuarants();
        fetchFilters();
    }, []);

    const fetchRestuarants = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/restaurants`);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const result = await response.json();
            setRestaurants(result.restaurants);

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred");
            }
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
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    // Skeleton

    return (
        <div className="min-h-screen ml-10 bg-white">
            <header>
                <h1 className="text-2xl font-bold flex items-center gap-2 py-4">
                    <span className="text-xl">🍜</span> Munchies
                </h1>
            </header>

            <div className="flex">
                <aside className="p-6 bg-white border border-gray-200 rounded-lg w-64 hidden md:block mr-4">
                    <div className="mb-6">Filter</div>
                    <div className="mb-6">Food Category</div>
                    
                </aside>

                <div className="flex-1">
                    <div className="flex mb-2">
                        {
                            filters.map((filter) => (
                                <div className="flex bg-white border border-gray-200 rounded-lg pt-2 pb-4 pl-2 mr-2 w-[160px] h-[80px]">
                                    <div className="text-sm font-medium text-gray-700">
                                        {filter.name}
                                    </div>
                                    <img
                                        className="ml-auto w-[80px] h-[80px] object-contain"
                                        src={`${import.meta.env.VITE_BACKEND_BASE_URL}${filter.image_url}`}
                                        alt="icons"
                                    />
                                </div>
                            ))
                        }
                    </div>

                    <div className="mt-4 mb-2">
                        <h2 className="text-[2rem]">
                            Restaurant's
                        </h2>
                    </div>
                    <div className="flex flex-wrap">
                        {restaurants && Array.isArray(restaurants) ? (
                            restaurants.map((restaurant) => (
                                <Card
                                    key={restaurant.id}
                                    name={restaurant.name}
                                    status={'open'}
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
        </div>
    );
};

export default Home;

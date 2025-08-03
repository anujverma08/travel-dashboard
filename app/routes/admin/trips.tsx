import {Header, TripCard} from "../../../components";
import {type LoaderFunctionArgs, useSearchParams} from "react-router";
import {getAllTrips, getTripById} from "~/appwrite/trips";
import {parseTripData} from "~/lib/utils";
import type {Route} from './+types/trips'
import {useState} from "react";
import {PagerComponent} from "@syncfusion/ej2-react-grids";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    try {
        const limit = 8;
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') || "1", 10);
        const offset = (page - 1) * limit;

        const { allTrips, total } = await getAllTrips(limit, offset);
        
        // Debug logging
        console.log('All trips raw data:', allTrips);
        
        return {
            trips: allTrips.map(({ $id, tripDetail, imageUrls }) => { // Changed from tripDetails to tripDetail
                // Add validation before parsing
                if (!tripDetail) {
                    console.error('tripDetail is missing for trip:', $id);
                    return null;
                }

                const parsedTrip = parseTripData(tripDetail);
                
                if (!parsedTrip) {
                    console.error('Failed to parse trip data for:', $id);
                    return null;
                }

                return {
                    id: $id,
                    ...parsedTrip,
                    imageUrls: imageUrls ?? []
                };
            }).filter(Boolean), // Remove null entries
            total
        };
    } catch (error) {
        console.error('Error loading trips:', error);
        return {
            trips: [],
            total: 0
        };
    }
}

const Trips = ({ loaderData }: Route.ComponentProps) => {
    const trips = (loaderData.trips as Trip[]) || [];
    
    const [searchParams] = useSearchParams();
    const initialPage = Number(searchParams.get('page') || '1');

    const [currentPage, setCurrentPage] = useState(initialPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.location.search = `?page=${page}`;
    }

    // Handle empty trips state
    if (!trips || trips.length === 0) {
        return (
            <main className="all-users wrapper">
                <Header
                    title="Trips"
                    description="View and edit AI-generated travel plans"
                    ctaText="Create a trip"
                    ctaUrl="/trips/create"
                />

                <section>
                    <h1 className="p-24-semibold text-dark-100 mb-4">
                        Manage Created Trips
                    </h1>

                    <div className="text-center py-20">
                        <h2 className="p-24-semibold text-dark-100 mb-4">No Trips Found</h2>
                        <p className="text-dark-400 mb-6">
                            You haven't created any trips yet. Create your first trip to get started!
                        </p>
                        <a 
                            href="/trips/create" 
                            className="button-class inline-flex items-center gap-2 px-6 py-3"
                        >
                            Create Your First Trip
                        </a>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main className="all-users wrapper">
            <Header
                title="Trips"
                description="View and edit AI-generated travel plans"
                ctaText="Create a trip"
                ctaUrl="/trips/create"
            />

            <section>
                <h1 className="p-24-semibold text-dark-100 mb-4">
                    Manage Created Trips ({loaderData.total} total)
                </h1>

                <div className="trip-grid mb-4">
                    {trips.map((trip) => (
                        <TripCard
                            key={trip.id}
                            id={trip.id}
                            name={trip.name || 'Unnamed Trip'}
                            imageUrl={trip.imageUrls?.[0] || '/assets/images/placeholder.jpg'}
                            location={trip.itinerary?.[0]?.location ?? "Unknown Location"}
                            tags={[trip.interests, trip.travelStyle].filter(Boolean)}
                            price={trip.estimatedPrice || '$0'}
                        />
                    ))}
                </div>

                {/* Only show pagination if there are multiple pages */}
                {loaderData.total > 8 && (
                    <PagerComponent
                        totalRecordsCount={loaderData.total}
                        pageSize={8}
                        currentPage={currentPage}
                        click={(args) => handlePageChange(args.currentPage)}
                        cssClass="!mb-4"
                    />
                )}
            </section>
        </main>
    )
}

export default Trips

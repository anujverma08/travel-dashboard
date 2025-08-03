import type {LoaderFunctionArgs} from "react-router";
import {getAllTrips, getTripById} from "~/appwrite/trips";
import type { Route } from './+types/trip-detail';
import {cn, getFirstWord, parseTripData} from "~/lib/utils";
import {Header,InfoPill, TripCard} from "../../../components";
import {ChipDirective, ChipListComponent, ChipsDirective} from "@syncfusion/ej2-react-buttons";

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const { tripId } = params;
    if(!tripId) throw new Error ('Trip ID is required');

    try {
        const [trip, trips] = await Promise.all([
            getTripById(tripId),
            getAllTrips(4, 0)
        ]);

        // // Debug logging with correct field name
        // console.log('Trip details raw data:', trip);
        // console.log('Trip detail type:', typeof trip?.tripDetail);
        // console.log('Trip detail content:', trip?.tripDetail);

        // Validate that trip exists and has tripDetail
        if (!trip || !trip.tripDetail) {
            console.error('Trip not found or missing tripDetail:', tripId);
            return { 
                trip: null, 
                allTrips: [],
                error: 'Trip not found'
            };
        }

        return {
            trip,
            allTrips: trips.allTrips?.map(({ $id, tripDetail, imageUrls }) => ({
                id: $id,
                ...parseTripData(tripDetail),
                imageUrls: imageUrls ?? []
            })).filter(Boolean) || [] // Remove null entries
        };
    } catch (error) {
        console.error('Error loading trip detail:', error);
        return { 
            trip: null, 
            allTrips: [],
            error: 'Failed to load trip details'
        };
    }
}

const TripDetail = ({ loaderData }: Route.ComponentProps) => {
    // Handle error state
    if (loaderData.error || !loaderData.trip) {
        return (
            <main className="travel-detail wrapper">
                <Header title="Trip Details" description="View and edit AI-generated travel plans" />
                <div className="container wrapper-md">
                    <div className="text-center py-20">
                        <h2 className="p-24-semibold text-dark-100 mb-4">
                            {loaderData.error || 'Trip Not Found'}
                        </h2>
                        <p className="text-dark-400">
                            The trip you're looking for could not be loaded. Please try again.
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    const imageUrls = loaderData?.trip?.imageUrls || [];
    
    // Parse trip data with error handling
    const tripData = parseTripData(loaderData?.trip?.tripDetail);

    // Handle parsing failure
    if (!tripData) {
        return (
            <main className="travel-detail wrapper">
                <Header title="Trip Details" description="View and edit AI-generated travel plans" />
                <div className="container wrapper-md">
                    <div className="text-center py-20">
                        <h2 className="p-24-semibold text-dark-100 mb-4">Failed to Load Trip</h2>
                        <p className="text-dark-400">
                            There was an error processing the trip data. Please try refreshing the page.
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    const {
        name, duration, itinerary, travelStyle,
        groupType, budget, interests, estimatedPrice,
        description, bestTimeToVisit, weatherInfo, country
    } = tripData;

    const allTrips = (loaderData.allTrips as Trip[]) || [];

    // Add safety checks for pill items
    const pillItems = [
        { text: travelStyle || '', bg: '!bg-pink-50 !text-pink-500' },
        { text: groupType || '', bg: '!bg-primary-50 !text-primary-500' },
        { text: budget || '', bg: '!bg-success-50 !text-success-700' },
        { text: interests || '', bg: '!bg-navy-50 !text-navy-500' },
    ].filter(item => item.text && item.text.trim() !== ''); // Remove empty items

    const visitTimeAndWeatherInfo = [
        { title: 'Best Time to Visit:', items: bestTimeToVisit || []},
        { title: 'Weather:', items: weatherInfo || []}
    ].filter(section => section.items && section.items.length > 0); // Only show sections with data

    return (
        <main className="travel-detail wrapper">
            <Header title="Trip Details" description="View and edit AI-generated travel plans" />

            <section className="container wrapper-md">
                <header>
                    <h1 className="p-40-semibold text-dark-100">{name || 'Trip Details'}</h1>
                    <div className="flex items-center gap-5">
                        <InfoPill
                            text={`${duration || 0} day plan`}
                            image="/assets/icons/calendar.svg"
                        />

                        <InfoPill
                            text={itinerary?.slice(0,4)
                                .map((item) => item.location).join(', ') || 'Locations TBD'}
                            image="/assets/icons/location-mark.svg"
                        />
                    </div>
                </header>

                {/* Only show gallery if images exist */}
                {imageUrls.length > 0 && (
                    <section className="gallery">
                        {imageUrls.map((url: string, i: number) => (
                            <img
                                src={url}
                                key={i}
                                alt={`Trip image ${i + 1}`}
                                className={cn('w-full rounded-xl object-cover', i === 0
                                ? 'md:col-span-2 md:row-span-2 h-[330px]'
                                : 'md:row-span-1 h-[150px]')}
                            />
                        ))}
                    </section>
                )}

                {/* Only show chips if we have pill items */}
                {pillItems.length > 0 && (
                    <section className="flex gap-3 md:gap-5 items-center flex-wrap">
                        <ChipListComponent id="travel-chip">
                            <ChipsDirective>
                                {pillItems.map((pill, i) => (
                                    <ChipDirective
                                        key={i}
                                        text={getFirstWord(pill.text)}
                                        cssClass={`${pill.bg} !text-base !font-medium !px-4`}
                                    />
                                ))}
                            </ChipsDirective>
                        </ChipListComponent>

                        <ul className="flex gap-1 items-center">
                            {Array(5).fill('null').map((_, index) => (
                                <li key={index}>
                                    <img
                                        src="/assets/icons/star.svg"
                                        alt="star"
                                        className="size-[18px]"
                                    />
                                </li>
                            ))}

                            <li className="ml-1">
                                <ChipListComponent>
                                    <ChipsDirective>
                                        <ChipDirective
                                            text="4.9/5"
                                            cssClass="!bg-yellow-50 !text-yellow-700"
                                        />
                                    </ChipsDirective>
                                </ChipListComponent>
                            </li>
                        </ul>
                    </section>
                )}

                <section className="title">
                    <article>
                        <h3>
                            {duration || 0}-Day {country || 'Adventure'} {travelStyle || 'Travel'} Trip
                        </h3>
                        <p>{budget || 'Budget TBD'}, {groupType || 'Group TBD'} and {interests || 'Various interests'}</p>
                    </article>

                    <h2>{estimatedPrice || '$0'}</h2>
                </section>

                <p className="text-sm md:text-lg font-normal text-dark-400">
                    {description || 'Trip description will be available soon.'}
                </p>

                {/* Only show itinerary if it exists */}
                {itinerary && itinerary.length > 0 && (
                    <ul className="itinerary">
                        {itinerary.map((dayPlan: DayPlan, index: number) => (
                            <li key={index}>
                                <h3>
                                    Day {dayPlan.day}: {dayPlan.location}
                                </h3>

                                <ul>
                                    {dayPlan.activities?.map((activity, actIndex: number) => (
                                        <li key={actIndex}>
                                            <span className="flex-shrink-0 p-18-semibold">{activity.time}</span>
                                            <p className="flex-grow">{activity.description}</p>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Only show visit time and weather if data exists */}
                {visitTimeAndWeatherInfo.map((section) => (
                    <section key={section.title} className="visit">
                        <div>
                            <h3>{section.title}</h3>

                            <ul>
                                {section.items?.map((item, itemIndex) => (
                                    <li key={itemIndex}>
                                        <p className="flex-grow">{item}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                ))}
            </section>

            {/* Only show popular trips if we have them */}
            {allTrips.length > 0 && (
                <section className="flex flex-col gap-6">
                    <h2 className="p-24-semibold text-dark-100">Popular Trips</h2>

                    <div className="trip-grid">
                        {allTrips.map((trip) => (
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
                </section>
            )}
        </main>
    )
}

export default TripDetail

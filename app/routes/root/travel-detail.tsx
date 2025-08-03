import {Link, type LoaderFunctionArgs} from "react-router";
import {getAllTrips, getTripById} from "~/appwrite/trips";
import type { Route } from './+types/travel-detail';
import {cn, getFirstWord, parseTripData} from "~/lib/utils";
import {Header, InfoPill, TripCard} from "../../../components";
import {ButtonComponent, ChipDirective, ChipListComponent, ChipsDirective} from "@syncfusion/ej2-react-buttons";

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const { tripId } = params;
    if(!tripId) throw new Error ('Trip ID is required');

    try {
        console.log('🚀 TravelDetail loader started for tripId:', tripId);

        const [trip, trips] = await Promise.all([
            getTripById(tripId),
            getAllTrips(4, 0)
        ]);

        console.log('📊 Raw trip data:', trip);
        console.log('📊 Raw trips data:', { total: trips.allTrips?.length, hasTrips: !!trips.allTrips });

        // Debug the main trip data
        if (!trip) {
            console.error('❌ No trip found for ID:', tripId);
            throw new Error('Trip not found');
        }

        console.log('🔍 Trip fields:', Object.keys(trip));
        console.log('🔍 Has tripDetail:', !!trip.tripDetail);
        console.log('🔍 Has tripDetails:', !!trip.tripDetails); // Check if it's using the wrong field name

        // Process related trips - FIXED: Changed from tripDetails to tripDetail
        const processedTrips = trips.allTrips?.map(({ $id, tripDetail, imageUrls }, index) => {
            console.log(`🔍 Processing related trip ${index + 1}:`, { $id, hasDetail: !!tripDetail });
            
            if (!tripDetail) {
                console.error('❌ tripDetail is missing for trip:', $id);
                return null;
            }

            const parsedTrip = parseTripData(tripDetail);
            
            if (!parsedTrip) {
                console.error('❌ Failed to parse trip data for:', $id);
                return null;
            }

            return {
                id: $id,
                ...parsedTrip,
                imageUrls: imageUrls ?? []
            };
        }).filter(Boolean) || [];

        console.log('✅ Successfully processed', processedTrips.length, 'related trips');

        return {
            trip,
            allTrips: processedTrips
        };
    } catch (error) {
        console.error('💥 TravelDetail loader error:', error);
        throw error;
    }
}

const TravelDetail = ({ loaderData }: Route.ComponentProps) => {
    console.log('🎨 TravelDetail component rendering with data:', loaderData);

    // Add error handling for missing trip data
    if (!loaderData?.trip) {
        return (
            <main className="travel-detail pt-40 wrapper">
                <div className="text-center py-20">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Trip Not Found</h2>
                    <p className="text-gray-600 mb-6">The trip you're looking for could not be loaded.</p>
                    <Link to="/" className="back-link">
                        <img src="/assets/icons/arrow-left.svg" alt="back icon" />
                        <span>Go back</span>
                    </Link>
                </div>
            </main>
        );
    }

    const imageUrls = loaderData?.trip?.imageUrls || [];
    
    // FIXED: Changed from tripDetails to tripDetail
    const tripData = parseTripData(loaderData?.trip?.tripDetail);
    console.log('🔧 Parsed trip data:', tripData);
    
    const paymentLink = loaderData?.trip?.payment_link;

    // Add fallback handling if tripData is null
    if (!tripData) {
        console.error('❌ Failed to parse trip data from:', loaderData?.trip?.tripDetail);
        return (
            <main className="travel-detail pt-40 wrapper">
                <div className="text-center py-20">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Trip Details</h2>
                    <p className="text-gray-600 mb-6">There was an error processing the trip information.</p>
                    <Link to="/" className="back-link">
                        <img src="/assets/icons/arrow-left.svg" alt="back icon" />
                        <span>Go back</span>
                    </Link>
                </div>
            </main>
        );
    }

    const {
        name, duration, itinerary, travelStyle,
        groupType, budget, interests, estimatedPrice,
        description, bestTimeToVisit, weatherInfo, country
    } = tripData;

    const allTrips = loaderData.allTrips as Trip[] | [];

    // Add safety checks for pill items
    const pillItems = [
        { text: travelStyle || 'Adventure', bg: '!bg-pink-50 !text-pink-500' },
        { text: groupType || 'Group', bg: '!bg-primary-50 !text-primary-500' },
        { text: budget || 'Budget', bg: '!bg-success-50 !text-success-700' },
        { text: interests || 'Explore', bg: '!bg-navy-50 !text-navy-500' },
    ].filter(item => item.text && item.text !== 'undefined');

    const visitTimeAndWeatherInfo = [
        { title: 'Best Time to Visit:', items: bestTimeToVisit || []},
        { title: 'Weather:', items: weatherInfo || []}
    ].filter(section => section.items && section.items.length > 0);

    return (
        <main className="travel-detail pt-40 wrapper">
            <div className="travel-div">
                <Link to="/" className="back-link">
                    <img src="/assets/icons/arrow-left.svg" alt="back icon" />
                    <span>Go back</span>
                </Link>

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
                                    .map((item) => item.location).join(', ') || 'Amazing destinations'}
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
                                {duration || 0}-Day {country || 'Adventure'} {travelStyle || 'Trip'}
                            </h3>
                            <p>{budget || 'Budget'}, {groupType || 'Group'} and {interests || 'Various interests'}</p>
                        </article>

                        <h2>{estimatedPrice || 'Price on request'}</h2>
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
                                                {/* FIXED: typo flex-shring-0 to flex-shrink-0 */}
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

                    {/* Only show payment button if payment link exists */}
                    {paymentLink && (
                        <a href={paymentLink} className="flex">
                            <ButtonComponent className="button-class" type="submit">
                                <span className="p-16-semibold text-white">
                                    Pay to join the trip
                                </span>
                                <span className="price-pill">{estimatedPrice || 'Contact us'}</span>
                            </ButtonComponent>
                        </a>
                    )}
                </section>
            </div>

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
                                price={trip.estimatedPrice || 'Price on request'}
                            />
                        ))}
                    </div>
                </section>
            )}
        </main>
    )
}

export default TravelDetail;

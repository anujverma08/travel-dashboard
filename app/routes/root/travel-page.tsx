import {Link, type LoaderFunctionArgs, useSearchParams} from "react-router";
import {ButtonComponent} from "@syncfusion/ej2-react-buttons";
import {cn, parseTripData} from "~/lib/utils";
import {Header, TripCard} from "../../../components";
import {getAllTrips} from "~/appwrite/trips";
import type {Route} from "../../../.react-router/types/app/routes/admin/+types/trips";
import {useState} from "react";
import {getUser} from "~/appwrite/auth";
import {PagerComponent} from "@syncfusion/ej2-react-grids";

const FeaturedDestination = ({ containerClass = '', bigCard = false, rating, title, activityCount, bgImage }: DestinationProps) => (
    <div className={cn('group relative rounded-2xl overflow-hidden bg-cover bg-center size-full min-w-[280px] cursor-pointer transform transition-all duration-300 hover:scale-105', containerClass, bgImage)}>
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent group-hover:from-black/80 transition-all duration-300"></div>
        
        {/* Content */}
        <div className="relative h-full flex flex-col justify-end p-6">
            {/* Rating badge */}
            <div className="absolute top-4 left-4">
                <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                    <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    <span className="text-sm font-bold text-gray-800">{rating}</span>
                </div>
            </div>

            {/* Main content */}
            <div className="space-y-4">
                <h3 className={cn('font-bold text-white leading-tight group-hover:text-blue-200 transition-colors duration-300', {
                    'text-2xl md:text-3xl': bigCard,
                    'text-lg': !bigCard
                })}>
                    {title}
                </h3>

                <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2">
                        <img
                            src="/assets/images/david.webp"
                            alt="guide"
                            className={cn('rounded-full border-2 border-white/50', {
                                'w-8 h-8': !bigCard,
                                'w-10 h-10': bigCard
                            })}
                        />
                        <span className={cn('text-white/90 font-medium', {
                            'text-sm': !bigCard,
                            'text-base': bigCard
                        })}>
                            {activityCount} activities
                        </span>
                    </div>
                </div>

                {/* Explore button */}
                <div className="pt-2">
                    <div className="inline-flex items-center space-x-2 text-white/80 group-hover:text-white transition-colors duration-300">
                        <span className="text-sm font-medium">Explore destination</span>
                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export const loader = async ({ request }: LoaderFunctionArgs) => {
    try {
        const limit = 8;
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') || "1", 10);
        const offset = (page - 1) * limit;

        const [user, { allTrips, total }] = await Promise.all([
            getUser(),
            getAllTrips(limit, offset),
        ]);

        // Fixed: Changed from tripDetails to tripDetail
        const processedTrips = allTrips.map(({ $id, tripDetail, imageUrls }) => {
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
        }).filter(Boolean); // Remove null entries

        return {
            trips: processedTrips,
            total,
            user
        };
    } catch (error) {
        console.error('Error loading travel page:', error);
        return {
            trips: [],
            total: 0,
            user: null
        };
    }
};

const TravelPage = ({ loaderData }: Route.ComponentProps) => {
    const { trips, total, user } = loaderData;
    const [searchParams] = useSearchParams();
    const initialPage = Number(searchParams.get('page') || '1');
    const [currentPage, setCurrentPage] = useState(initialPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.location.search = `?page=${page}`;
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-indigo-600/10"></div>
                <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl"></div>
                
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="space-y-8">
                        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
                            Plan Your Dream
                            <br />
                            <span className="block">Adventure</span>
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Discover breathtaking destinations, create personalized itineraries, and embark on unforgettable journeys with our AI-powered travel companion.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                            <Link to="#trips">
                                <ButtonComponent 
                                    type="button" 
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                >
                                    Start Your Journey
                                </ButtonComponent>
                            </Link>
                            
                            <Link to="#destinations">
                                <ButtonComponent 
                                    type="button" 
                                    className="border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all duration-300"
                                >
                                    Explore Destinations
                                </ButtonComponent>
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 max-w-2xl mx-auto">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-blue-600">50+</div>
                                <div className="text-gray-600">Countries</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-indigo-600">1000+</div>
                                <div className="text-gray-600">Destinations</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-purple-600">10K+</div>
                                <div className="text-gray-600">Happy Travelers</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </section>

            {/* Featured Destinations */}
            <section id="destinations" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Featured Destinations
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Discover the world's most captivating places, handpicked by travel experts
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px]">
                    {/* Large featured card */}
                    <div className="lg:col-span-7 h-full">
                        <FeaturedDestination
                            bgImage="bg-card-1"
                            containerClass="h-full"
                            bigCard
                            title="Barcelona Adventure"
                            rating={4.8}
                            activityCount={196}
                        />
                    </div>

                    {/* Right column */}
                    <div className="lg:col-span-5 grid grid-rows-2 gap-6 h-full">
                        <FeaturedDestination
                            bgImage="bg-card-2"
                            containerClass="h-full"
                            title="London Explorer"
                            rating={4.5}
                            activityCount={312}
                        />
                        <FeaturedDestination
                            bgImage="bg-card-3"
                            containerClass="h-full"
                            title="Tokyo Discovery"
                            rating={4.9}
                            activityCount={250}
                        />
                    </div>
                </div>

                {/* Bottom row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 h-64">
                    <FeaturedDestination
                        containerClass="h-full"
                        bgImage="bg-card-4"
                        title="Spanish Getaway"
                        rating={4.2}
                        activityCount={180}
                    />
                    <FeaturedDestination
                        containerClass="h-full"
                        bgImage="bg-card-5"
                        title="Australian Safari"
                        rating={4.7}
                        activityCount={220}
                    />
                    <FeaturedDestination
                        containerClass="h-full"
                        bgImage="bg-card-6"
                        title="Italian Romance"
                        rating={4.6}
                        activityCount={340}
                    />
                </div>
            </section>

            {/* Handpicked Trips */}
            <section id="trips" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Handpicked Adventures
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Carefully curated trips designed to match your travel style and preferences
                        </p>
                    </div>

                    {trips.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                                {trips.map((trip) => (
                                    <div key={trip.id} className="transform hover:scale-105 transition-transform duration-300">
                                        <TripCard
                                            id={trip.id}
                                            name={trip.name || 'Unnamed Adventure'}
                                            imageUrl={trip.imageUrls?.[0] || '/assets/images/placeholder.jpg'}
                                            location={trip.itinerary?.[0]?.location ?? "Exciting Destination"}
                                            tags={[trip.interests, trip.travelStyle].filter(Boolean)}
                                            price={trip.estimatedPrice || 'Price on request'}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {total > 8 && (
                                <div className="flex justify-center">
                                    <PagerComponent
                                        totalRecordsCount={total}
                                        pageSize={8}
                                        currentPage={currentPage}
                                        click={(args) => handlePageChange(args.currentPage)}
                                        cssClass="modern-pagination"
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-16">
                            <div className="max-w-md mx-auto">
                                <img 
                                    src="/assets/images/no-trips.svg" 
                                    alt="No trips" 
                                    className="w-32 h-32 mx-auto mb-6 opacity-50"
                                />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    No trips available
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Check back soon for exciting new adventures!
                                </p>
                                <Link to="/trips/create">
                                    <ButtonComponent className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold">
                                        Create Your First Trip
                                    </ButtonComponent>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Ready for Your Next Adventure?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Join thousands of travelers who've discovered their perfect trips with our AI-powered planning tools.
                    </p>
                    <Link to="/trips/create">
                        <ButtonComponent className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                            Start Planning Now
                        </ButtonComponent>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Logo and description */}
                        <div className="md:col-span-2">
                            <Link to="/" className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                    <img
                                        src="/assets/icons/logo.svg"
                                        alt="TripWise Logo"
                                        className="w-6 h-6 filter brightness-0 invert"
                                    />
                                </div>
                                <h3 className="text-2xl font-bold">TripWise</h3>
                            </Link>
                            <p className="text-gray-400 mb-6 max-w-md">
                                Your AI-powered travel companion for discovering amazing destinations and creating unforgettable experiences.
                            </p>
                            <div className="flex space-x-4">
                                {/* Social media links */}
                                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/></svg>
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2">
                                <li><Link to="/destinations" className="text-gray-400 hover:text-white transition-colors duration-200">Destinations</Link></li>
                                <li><Link to="/trips" className="text-gray-400 hover:text-white transition-colors duration-200">My Trips</Link></li>
                                <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors duration-200">About Us</Link></li>
                                <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors duration-200">Contact</Link></li>
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2">
                                <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors duration-200">Terms & Conditions</Link></li>
                                <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors duration-200">Privacy Policy</Link></li>
                                <li><Link to="/cookies" className="text-gray-400 hover:text-white transition-colors duration-200">Cookie Policy</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 text-sm">
                            © 2024 TripWise. All rights reserved.
                        </p>
                        <p className="text-gray-400 text-sm mt-2 md:mt-0">
                            Made with ❤️ for travelers worldwide
                        </p>
                    </div>
                </div>
            </footer>
        </main>
    );
};

export default TravelPage;

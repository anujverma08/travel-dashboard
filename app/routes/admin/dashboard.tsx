import {Header, StatsCard, TripCard} from "../../../components";
import {getAllUsers, getUser} from "~/appwrite/auth";
import type { Route } from './+types/dashboard';
import {getTripsByTravelStyle, getUserGrowthPerDay, getUsersAndTripsStats} from "~/appwrite/dashboard";
import {getAllTrips} from "~/appwrite/trips";
import {parseTripData} from "~/lib/utils";
import {
    Category,
    ChartComponent,
    ColumnSeries,
    DataLabel, SeriesCollectionDirective, SeriesDirective,
    SplineAreaSeries,
    Tooltip
} from "@syncfusion/ej2-react-charts";
import {ColumnDirective, ColumnsDirective, GridComponent, Inject} from "@syncfusion/ej2-react-grids";
import {tripXAxis, tripyAxis, userXAxis, useryAxis} from "~/constants";
import {redirect} from "react-router";

export const clientLoader = async () => {
    try {
        const [
            user,
            dashboardStats,
            trips,
            userGrowth,
            tripsByTravelStyle,
            allUsers,
        ] = await Promise.all([
            getUser(), // Removed duplicate await
            getUsersAndTripsStats(),
            getAllTrips(4, 0),
            getUserGrowthPerDay(),
            getTripsByTravelStyle(),
            getAllUsers(4, 0),
        ]);

        // Fixed: Changed from tripDetails to tripDetail to match your database schema
        const allTrips = trips.allTrips.map(({ $id, tripDetail, imageUrls }) => {
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

        const mappedUsers: UsersItineraryCount[] = allUsers.users.map((user) => ({
            imageUrl: user.imageUrl || '/assets/images/default-avatar.png',
            name: user.name || 'Unknown User',
            count: user.itineraryCount ?? Math.floor(Math.random() * 10),
        }));

        return {
            user,
            dashboardStats,
            allTrips,
            userGrowth,
            tripsByTravelStyle,
            allUsers: mappedUsers
        };
    } catch (error) {
        console.error('Dashboard loader error:', error);
        
        // Check if it's an authentication error
        if (error?.code === 401) {
            throw redirect('/'); // Redirect to sign-in page
        }

        // Return default data structure to prevent crashes
        return {
            user: null,
            dashboardStats: {
                totalUsers: 0,
                usersJoined: { currentMonth: 0, lastMonth: 0 },
                userRole: { total: 0, currentMonth: 0, lastMonth: 0 },
                totalTrips: 0,
                tripsCreated: { currentMonth: 0, lastMonth: 0 }
            },
            allTrips: [],
            userGrowth: [],
            tripsByTravelStyle: [],
            allUsers: []
        };
    }
};

const Dashboard = ({ loaderData }: Route.ComponentProps) => {
    const user = loaderData.user as User | null;
    const { dashboardStats, allTrips, userGrowth, tripsByTravelStyle, allUsers } = loaderData;

    // Add safety checks for trip data
    const trips = allTrips.map((trip) => ({
        imageUrl: trip.imageUrls?.[0] || '/assets/images/placeholder.jpg',
        name: trip.name || 'Unnamed Trip',
        interest: trip.interests || 'Various',
    }));

    const usersAndTrips = [
        {
            title: 'Latest user signups',
            dataSource: allUsers,
            field: 'count',
            headerText: 'Trips created'
        },
        {
            title: 'Trips based on interests',
            dataSource: trips,
            field: 'interest',
            headerText: 'Interests'
        }
    ];

    return (
        <main className="dashboard wrapper">
            <Header
                title={`Welcome ${user?.name ?? 'Guest'} 👋`}
                description="Track activity, trends and popular destinations in real time"
            />

            <section className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    <StatsCard
                        headerTitle="Total Users"
                        total={dashboardStats.totalUsers}
                        currentMonthCount={dashboardStats.usersJoined.currentMonth}
                        lastMonthCount={dashboardStats.usersJoined.lastMonth}
                    />
                    <StatsCard
                        headerTitle="Total Trips"
                        total={dashboardStats.totalTrips}
                        currentMonthCount={dashboardStats.tripsCreated.currentMonth}
                        lastMonthCount={dashboardStats.tripsCreated.lastMonth}
                    />
                    <StatsCard
                        headerTitle="Active Users"
                        total={dashboardStats.userRole.total}
                        currentMonthCount={dashboardStats.userRole.currentMonth}
                        lastMonthCount={dashboardStats.userRole.lastMonth}
                    />
                </div>
            </section>

            {/* Only show trips section if we have trips */}
            {allTrips.length > 0 ? (
                <section className="container">
                    <h1 className="text-xl font-semibold text-dark-100">Created Trips</h1>

                    <div className='trip-grid'>
                        {allTrips.map((trip) => (
                            <TripCard
                                key={trip.id}
                                id={trip.id.toString()}
                                name={trip.name || 'Unnamed Trip'}
                                imageUrl={trip.imageUrls?.[0] || '/assets/images/placeholder.jpg'}
                                location={trip.itinerary?.[0]?.location ?? 'Unknown Location'}
                                tags={[trip.interests, trip.travelStyle].filter(Boolean)}
                                price={trip.estimatedPrice || '$0'}
                            />
                        ))}
                    </div>
                </section>
            ) : (
                <section className="container">
                    <h1 className="text-xl font-semibold text-dark-100">Created Trips</h1>
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No trips found. Create your first trip!</p>
                    </div>
                </section>
            )}

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* User Growth Chart */}
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                    {userGrowth.length > 0 ? (
                        <ChartComponent
                            id="chart-1"
                            primaryXAxis={userXAxis}
                            primaryYAxis={useryAxis}
                            title="User Growth"
                            tooltip={{ enable: true }}
                        >
                            <Inject services={[ColumnSeries, SplineAreaSeries, Category, DataLabel, Tooltip]} />

                            <SeriesCollectionDirective>
                                <SeriesDirective
                                    dataSource={userGrowth}
                                    xName="day"
                                    yName="count"
                                    type="Column"
                                    name="New Users"
                                    columnWidth={0.3}
                                    cornerRadius={{topLeft: 10, topRight: 10}}
                                />

                                <SeriesDirective
                                    dataSource={userGrowth}
                                    xName="day"
                                    yName="count"
                                    type="SplineArea"
                                    name="Growth Trend"
                                    fill="rgba(71, 132, 238, 0.3)"
                                    border={{ width: 2, color: '#4784EE'}}
                                />
                            </SeriesCollectionDirective>
                        </ChartComponent>
                    ) : (
                        <div className="h-[300px] flex items-center justify-center text-gray-500">
                            <p>No user growth data available</p>
                        </div>
                    )}
                </div>

                {/* Travel Style Chart */}
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                    {tripsByTravelStyle.length > 0 ? (
                        <ChartComponent
                            id="chart-2"
                            primaryXAxis={tripXAxis}
                            primaryYAxis={tripyAxis}
                            title="Trip Trends"
                            tooltip={{ enable: true }}
                        >
                            <Inject services={[ColumnSeries, Category, DataLabel, Tooltip]} />

                            <SeriesCollectionDirective>
                                <SeriesDirective
                                    dataSource={tripsByTravelStyle}
                                    xName="travelStyle"
                                    yName="count"
                                    type="Column"
                                    name="Trips"
                                    columnWidth={0.3}
                                    cornerRadius={{topLeft: 10, topRight: 10}}
                                />
                            </SeriesCollectionDirective>
                        </ChartComponent>
                    ) : (
                        <div className="h-[300px] flex items-center justify-center text-gray-500">
                            <p>No travel style data available</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Users and Trips Grid */}
            <section className="user-trip wrapper">
                {usersAndTrips.map(({ title, dataSource, field, headerText}, i) => (
                    <div key={i} className="flex flex-col gap-5">
                        <h3 className="p-20-semibold text-dark-100">{title}</h3>

                        {dataSource.length > 0 ? (
                            <GridComponent dataSource={dataSource} gridLines="None">
                                <ColumnsDirective>
                                    <ColumnDirective
                                        field="name"
                                        headerText="Name"
                                        width="200"
                                        textAlign="Left"
                                        template={(props: UserData) => (
                                            <div className="flex items-center gap-1.5 px-4">
                                                <img 
                                                    src={props.imageUrl || '/assets/images/default-avatar.png'} 
                                                    alt="user" 
                                                    className="rounded-full size-8 aspect-square" 
                                                    referrerPolicy="no-referrer" 
                                                />
                                                <span>{props.name}</span>
                                            </div>
                                        )}
                                    />

                                    <ColumnDirective
                                        field={field}
                                        headerText={headerText}
                                        width="150"
                                        textAlign="Left"
                                    />
                                </ColumnsDirective>
                            </GridComponent>
                        ) : (
                            <div className="p-8 text-center text-gray-500 border rounded-lg">
                                <p>No {title.toLowerCase()} available</p>
                            </div>
                        )}
                    </div>
                ))}
            </section>
        </main>
    );
};

export default Dashboard;
    
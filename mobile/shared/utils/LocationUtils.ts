interface Coordinate {
    latitude: number;
    longitude: number;
}

/**
 * Get the distance between two coordinates in meters using the haversine formula.
 * @param coord1 The first coordinate (lat, lng)
 * @param coord2 The second coordinate (lat, lng)
 * @returns The distance between the two coordinates in meters
 */
export const getDistanceBetweenCoordsMeters = (coord1: Coordinate, coord2: Coordinate): number => {
    // Radius of the Earth in meters
    const R = 6371000.0;

    // Convert latitude and longitude from degrees to radians
    const [rLat1, rLng1, rLat2, rLng2] = [coord1.latitude, coord1.longitude, coord2.latitude, coord2.longitude].map(
        (angle) => (angle * Math.PI) / 180
    );

    // Differences in coordinates
    const dlat = rLat2 - rLat1;
    const dlng = rLng2 - rLng1;

    // Haversine formula to calculate the distance between two points on a sphere (https://en.wikipedia.org/wiki/Haversine_formula)
    const a = Math.sin(dlat / 2) ** 2 + Math.cos(rLat1) * Math.cos(rLat2) * Math.sin(dlng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Calculate the distance
    const distance = R * c;
    return distance;
};

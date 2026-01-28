import axios from 'axios';
import { hotelService } from '../hotelService';
import api from '../api';

jest.mock('../api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('hotelService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getHotels', () => {
        it('fetches all hotels successfully', async () => {
            const mockHotels = [
                { id: 1, name: 'Hotel 1', address: 'Address 1', rating: 4.5 },
                { id: 2, name: 'Hotel 2', address: 'Address 2', rating: 4.8 }
            ];

            mockedApi.get.mockResolvedValue({ data: mockHotels });

            const result = await hotelService.getHotels();

            expect(mockedApi.get).toHaveBeenCalledWith('/hotels');
            expect(result).toEqual(mockHotels);
        });

        it('throws error when API call fails', async () => {
            const error = new Error('Network error');
            mockedApi.get.mockRejectedValue(error);

            await expect(hotelService.getHotels()).rejects.toThrow('Network error');
        });
    });

    describe('getHotel', () => {
        it('fetches hotel with rooms successfully', async () => {
            const mockHotel = {
                id: 1,
                name: 'Hotel 1',
                address: 'Address 1',
                rating: 4.5,
                rooms: [
                    { id: 1, room_type: 'Single', price_per_night: 100 },
                    { id: 2, room_type: 'Double', price_per_night: 150 }
                ]
            };

            mockedApi.get.mockResolvedValue({ data: mockHotel });

            const result = await hotelService.getHotel(1);

            expect(mockedApi.get).toHaveBeenCalledWith('/hotels/1');
            expect(result).toEqual(mockHotel);
        });

        it('throws error for 404', async () => {
            const error = { response: { status: 404 } };
            mockedApi.get.mockRejectedValue(error);

            await expect(hotelService.getHotel(999)).rejects.toThrow('Hotel not found');
        });
    });

    describe('getHotelRooms', () => {
        it('fetches hotel rooms successfully', async () => {
            const mockRooms = [
                { id: 1, room_type: 'Single', price_per_night: 100 },
                { id: 2, room_type: 'Double', price_per_night: 150 }
            ];

            mockedApi.get.mockResolvedValue({ data: mockRooms });

            const result = await hotelService.getHotelRooms(1);

            expect(mockedApi.get).toHaveBeenCalledWith('/hotels/1/rooms');
            expect(result).toEqual(mockRooms);
        });
    });
});

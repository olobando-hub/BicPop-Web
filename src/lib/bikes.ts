export interface Bike {
  id: string;
  name: string;
  type: 'mechanical' | 'electric';
  price: number;
  image: string;
  battery?: number; // Only for electric bikes
  available: boolean;
  location: string;
}

export const mockBikes: Bike[] = [
  {
    id: '1',
    name: 'Urban Classic',
    type: 'mechanical',
    price: 2500,
    image: 'https://www.simplebikestore.eu/cdn/shop/files/urban-bike-gates-carbon-drive-petrol-mikamaro.jpg',
    available: true,
    location: 'Centro Histórico'
  },
  {
    id: '2',
    name: 'EcoBolt Pro',
    type: 'electric',
    price: 4500,
    image: 'https://thumb.pccomponentes.com/w-530-530/articles/42/426215/1886-eovolt-city-4speed-bicicleta-electrica-plegable-verde.jpg',
    battery: 85,
    available: true,
    location: 'Universidad del Cauca'
  },
  {
    id: '3',
    name: 'City Cruiser',
    type: 'mechanical',
    price: 2000,
    image: 'https://www.solebicycles.com/cdn/shop/products/CTB3001-1-Web_961a790d-6644-4f80-87c5-73c65269a521_1445x.jpg?v=1682101319',
    available: true,
    location: 'Parque Caldas'
  },
  {
    id: '4',
    name: 'Thunder E-Bike',
    type: 'electric',
    price: 5000,
    image: 'https://richmondebike.com/cdn/shop/products/20201219_151538_360x.jpg',
    battery: 92,
    available: false,
    location: 'Terminal de Transporte'
  },
  {
    id: '5',
    name: 'Mountain Explorer',
    type: 'mechanical',
    price: 3000,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3ScOVsZg65QBk5_ZF6vD7T21rkDsyRtf4AcOxpxvGgzyM_q18-J6-qEwOoGc8jvmCpmM&usqp=CAU',
    available: true,
    location: 'Rincon Payanes'
  },
  {
    id: '6',
    name: 'Eco Lightning',
    type: 'electric',
    price: 4800,
    image: 'https://www.ecotric.com/cdn/shop/products/NS-FAT20850C-RD_9e4d7a2f-4e29-4cf3-b945-9e944274ea51.jpg?v=1666771190&width=1946',
    battery: 78,
    available: true,
    location: 'Centro Comercial Campanario'
  }
];
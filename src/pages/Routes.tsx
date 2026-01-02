import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Route {
  id: string;
  number: string;
  name: string;
  type: 'bus' | 'trolleybus' | 'tram';
  from: string;
  to: string;
}

const mockRoutes: Route[] = [
  { id: '1', number: '120', name: 'Маршрут 120', type: 'bus', from: 'Метро Университет', to: 'Метро Проспект Вернадского' },
  { id: '2', number: '34', name: 'Маршрут 34', type: 'bus', from: 'Метро Киевская', to: 'Метро Смоленская' },
  { id: '3', number: '10', name: 'Маршрут 10', type: 'trolleybus', from: 'Метро ВДНХ', to: 'Лубянская площадь' },
  { id: '4', number: '39', name: 'Маршрут 39', type: 'tram', from: 'Метро Чистые пруды', to: 'Метро Красные ворота' },
  { id: '5', number: 'м1', name: 'Маршрут м1', type: 'bus', from: 'Метро Юго-Западная', to: 'Метро Тропарёво' },
  { id: '6', number: '144', name: 'Маршрут 144', type: 'bus', from: 'Метро Кунцевская', to: 'Метро Молодёжная' },
];

const Routes = () => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bus':
        return 'Bus';
      case 'trolleybus':
        return 'Zap';
      case 'tram':
        return 'Train';
      default:
        return 'Bus';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bus':
        return 'bg-blue-500';
      case 'trolleybus':
        return 'bg-green-500';
      case 'tram':
        return 'bg-orange-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Icon name="Bus" size={32} />
              <h1 className="text-2xl font-bold">Транспорт</h1>
            </Link>
            <nav className="flex gap-2">
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary/90" asChild>
                <Link to="/">Главная</Link>
              </Button>
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary/90" asChild>
                <Link to="/routes">Маршруты</Link>
              </Button>
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary/90" asChild>
                <Link to="/search">Поиск</Link>
              </Button>
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary/90" asChild>
                <Link to="/about">О сервисе</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">Все маршруты</h2>
          <p className="text-muted-foreground">Выберите маршрут для просмотра остановок и карты</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockRoutes.map((route) => (
            <Card key={route.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`${getTypeColor(route.type)} p-3 rounded-lg text-white`}>
                      <Icon name={getTypeIcon(route.type)} size={24} />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold">{route.number}</CardTitle>
                      <Badge variant="secondary" className="mt-1">{route.type === 'bus' ? 'Автобус' : route.type === 'trolleybus' ? 'Троллейбус' : 'Трамвай'}</Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleFavorite(route.id)}
                    className="hover:bg-accent"
                  >
                    <Icon
                      name={favorites.has(route.id) ? 'Star' : 'Star'}
                      size={20}
                      className={favorites.has(route.id) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}
                    />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Icon name="MapPin" size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{route.from}</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <Icon name="MoveDown" size={16} className="text-muted-foreground" />
                  </div>
                  <div className="flex items-start gap-2">
                    <Icon name="MapPin" size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{route.to}</span>
                  </div>
                  <Link to={`/route/${route.id}`}>
                    <Button className="w-full mt-4" variant="default">
                      Подробнее
                      <Icon name="ArrowRight" size={16} className="ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Routes;

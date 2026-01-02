import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

interface Stop {
  id: string;
  name: string;
  time?: string;
}

interface RouteInfo {
  id: string;
  number: string;
  name: string;
  type: 'bus' | 'trolleybus' | 'tram';
  from: string;
  to: string;
  stops: Stop[];
}

const mockRouteData: Record<string, RouteInfo> = {
  '1': {
    id: '1',
    number: '120',
    name: 'Маршрут 120',
    type: 'bus',
    from: 'Метро Университет',
    to: 'Метро Проспект Вернадского',
    stops: [
      { id: '1', name: 'Метро Университет', time: '00:00' },
      { id: '2', name: 'Улица Крупской', time: '00:03' },
      { id: '3', name: 'Проспект Вернадского', time: '00:06' },
      { id: '4', name: 'Ломоносовский проспект', time: '00:09' },
      { id: '5', name: 'Университетский проспект', time: '00:12' },
      { id: '6', name: 'Метро Проспект Вернадского', time: '00:15' },
    ],
  },
  '2': {
    id: '2',
    number: '34',
    name: 'Маршрут 34',
    type: 'bus',
    from: 'Метро Киевская',
    to: 'Метро Смоленская',
    stops: [
      { id: '1', name: 'Метро Киевская', time: '00:00' },
      { id: '2', name: 'Площадь Европы', time: '00:02' },
      { id: '3', name: 'Новый Арбат', time: '00:05' },
      { id: '4', name: 'Арбатская площадь', time: '00:08' },
      { id: '5', name: 'Метро Смоленская', time: '00:11' },
    ],
  },
};

const RouteDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [route, setRoute] = useState<RouteInfo | null>(null);
  const [selectedStop, setSelectedStop] = useState<string | null>(null);

  useEffect(() => {
    if (id && mockRouteData[id]) {
      setRoute(mockRouteData[id]);
    }
  }, [id]);

  useEffect(() => {
    if (!route) return;

    const script = document.createElement('script');
    script.src = 'https://api-maps.yandex.ru/2.1/?apikey=YOUR_API_KEY&lang=ru_RU';
    script.async = true;
    script.onload = () => {
      const ymaps = (window as any).ymaps;
      ymaps.ready(() => {
        const map = new ymaps.Map('map', {
          center: [55.751574, 37.573856],
          zoom: 12,
        });

        const multiRoute = new ymaps.multiRouter.MultiRoute({
          referencePoints: [
            route.from,
            ...route.stops.slice(1, -1).map(stop => stop.name),
            route.to,
          ],
          params: {
            routingMode: 'masstransit',
          }
        }, {
          boundsAutoApply: true,
          wayPointStartIconColor: '#2196F3',
          wayPointFinishIconColor: '#FF5722',
          routeActiveStrokeColor: '#2196F3',
          routeActiveStrokeWidth: 6,
        });

        map.geoObjects.add(multiRoute);
      });
    };
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src*="api-maps.yandex.ru"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, [route]);

  if (!route) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6 text-center">
            <Icon name="AlertCircle" size={48} className="mx-auto text-destructive mb-4" />
            <p className="text-lg">Маршрут не найден</p>
            <Link to="/routes">
              <Button className="mt-4">Вернуться к маршрутам</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

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
      <header className="bg-primary text-primary-foreground shadow-md">
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

      <main className="container mx-auto px-4 py-6">
        <div className="mb-4">
          <Link to="/routes">
            <Button variant="ghost" className="gap-2">
              <Icon name="ArrowLeft" size={20} />
              Назад к списку маршрутов
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          <Card className="lg:col-span-1 flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className={`${getTypeColor(route.type)} p-3 rounded-lg text-white`}>
                  <Icon name="Bus" size={24} />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold">{route.number}</CardTitle>
                  <Badge variant="secondary" className="mt-1">
                    {route.type === 'bus' ? 'Автобус' : route.type === 'trolleybus' ? 'Троллейбус' : 'Трамвай'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Icon name="MapPin" size={20} />
                Остановки маршрута
              </h3>
              <ScrollArea className="h-[calc(100%-2rem)]">
                <div className="space-y-2 pr-4">
                  {route.stops.map((stop, index) => (
                    <div
                      key={stop.id}
                      onClick={() => setSelectedStop(stop.id)}
                      className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                        selectedStop === stop.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50 hover:bg-accent/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                              index === 0
                                ? 'bg-green-500 text-white'
                                : index === route.stops.length - 1
                                ? 'bg-red-500 text-white'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {index + 1}
                          </div>
                          {index < route.stops.length - 1 && (
                            <div className="w-0.5 h-6 bg-muted mt-1" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{stop.name}</p>
                          {stop.time && (
                            <p className="text-sm text-muted-foreground mt-1">
                              +{stop.time} мин
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Map" size={24} />
                Карта маршрута
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div id="map" className="w-full h-[calc(100vh-320px)] min-h-[400px] rounded-b-lg"></div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default RouteDetail;

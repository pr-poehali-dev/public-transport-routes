import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface SearchResult {
  id: string;
  number: string;
  type: 'bus' | 'trolleybus' | 'tram';
  from: string;
  to: string;
}

const allRoutes: SearchResult[] = [
  { id: '1', number: '120', type: 'bus', from: 'Метро Университет', to: 'Метро Проспект Вернадского' },
  { id: '2', number: '34', type: 'bus', from: 'Метро Киевская', to: 'Метро Смоленская' },
  { id: '3', number: '10', type: 'trolleybus', from: 'Метро ВДНХ', to: 'Лубянская площадь' },
  { id: '4', number: '39', type: 'tram', from: 'Метро Чистые пруды', to: 'Метро Красные ворота' },
  { id: '5', number: 'м1', type: 'bus', from: 'Метро Юго-Западная', to: 'Метро Тропарёво' },
  { id: '6', number: '144', type: 'bus', from: 'Метро Кунцевская', to: 'Метро Молодёжная' },
];

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const filtered = allRoutes.filter(
      route =>
        route.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.to.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setResults(filtered);
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

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Icon name="Search" size={28} />
                Поиск маршрутов
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Введите номер маршрута или название остановки..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="text-lg"
                />
                <Button onClick={handleSearch} size="lg">
                  <Icon name="Search" size={20} />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                Примеры: "120", "Университет", "м1"
              </p>
            </CardContent>
          </Card>

          {results.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Найдено результатов: {results.length}
              </h2>
              <div className="grid gap-4">
                {results.map((route) => (
                  <Card key={route.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`${getTypeColor(route.type)} p-3 rounded-lg text-white`}>
                            <Icon name={getTypeIcon(route.type)} size={28} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-2xl font-bold">{route.number}</h3>
                              <Badge variant="secondary">
                                {route.type === 'bus' ? 'Автобус' : route.type === 'trolleybus' ? 'Троллейбус' : 'Трамвай'}
                              </Badge>
                            </div>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2">
                                <Icon name="MapPin" size={14} className="text-green-600" />
                                <span>{route.from}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Icon name="MapPin" size={14} className="text-red-600" />
                                <span>{route.to}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Link to={`/route/${route.id}`}>
                          <Button>
                            Подробнее
                            <Icon name="ArrowRight" size={16} className="ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {searchQuery && results.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Icon name="Search" size={64} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Ничего не найдено</h3>
                <p className="text-muted-foreground">
                  Попробуйте изменить запрос или проверьте правильность написания
                </p>
              </CardContent>
            </Card>
          )}

          {!searchQuery && results.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Icon name="Info" size={64} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Начните поиск</h3>
                <p className="text-muted-foreground">
                  Введите номер маршрута или название остановки в поле выше
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Search;

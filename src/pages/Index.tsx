import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const featuredRoutes = [
  { id: '1', number: '120', type: 'bus', from: 'Метро Университет', to: 'Метро Проспект Вернадского' },
  { id: '2', number: '34', type: 'bus', from: 'Метро Киевская', to: 'Метро Смоленская' },
  { id: '3', number: '10', type: 'trolleybus', from: 'Метро ВДНХ', to: 'Лубянская площадь' },
];

const Index = () => {
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

      <main>
        <section className="bg-gradient-to-br from-primary to-secondary text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-5xl font-bold mb-4">Городской транспорт</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Удобный сервис для поиска маршрутов общественного транспорта
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/routes">
                <Button size="lg" variant="secondary" className="text-lg">
                  <Icon name="Map" size={20} className="mr-2" />
                  Все маршруты
                </Button>
              </Link>
              <Link to="/search">
                <Button size="lg" variant="outline" className="text-lg bg-white/10 border-white/30 text-white hover:bg-white/20">
                  <Icon name="Search" size={20} className="mr-2" />
                  Поиск
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-3xl font-bold mb-2">Популярные маршруты</h3>
              <p className="text-muted-foreground">Часто используемые направления</p>
            </div>
            <Link to="/routes">
              <Button variant="outline">
                Все маршруты
                <Icon name="ArrowRight" size={16} className="ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRoutes.map((route) => (
              <Card key={route.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`${getTypeColor(route.type)} p-3 rounded-lg text-white`}>
                      <Icon name={getTypeIcon(route.type)} size={24} />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold">{route.number}</CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {route.type === 'bus' ? 'Автобус' : route.type === 'trolleybus' ? 'Троллейбус' : 'Трамвай'}
                      </Badge>
                    </div>
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
        </section>

        <section className="bg-muted py-12">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold mb-8 text-center">Возможности сервиса</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Map" size={32} className="text-primary" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2">Интерактивные карты</h4>
                  <p className="text-muted-foreground">
                    Визуализация маршрутов на картах Яндекс с точным отображением трасс
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Search" size={32} className="text-primary" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2">Умный поиск</h4>
                  <p className="text-muted-foreground">
                    Находите нужный маршрут по номеру или названию остановки
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Star" size={32} className="text-primary" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2">Избранное</h4>
                  <p className="text-muted-foreground">
                    Сохраняйте часто используемые маршруты для быстрого доступа
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-card border-t py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 Городской транспорт. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

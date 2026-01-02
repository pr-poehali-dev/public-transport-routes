import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const About = () => {
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
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-3">
                <Icon name="Info" size={36} />
                О сервисе
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-lg">
              <p>
                Сервис городского транспорта предоставляет актуальную информацию о маршрутах
                общественного транспорта города.
              </p>
              <p>
                Наша цель — сделать передвижение по городу максимально комфортным и понятным
                для каждого жителя и гостя города.
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="CheckCircle" size={24} className="text-green-600" />
                  Возможности сервиса
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Icon name="Circle" size={8} className="mt-2 flex-shrink-0" />
                    <span>Просмотр всех доступных маршрутов транспорта</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Circle" size={8} className="mt-2 flex-shrink-0" />
                    <span>Детальная информация о каждом маршруте</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Circle" size={8} className="mt-2 flex-shrink-0" />
                    <span>Интерактивная карта с визуализацией маршрутов</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Circle" size={8} className="mt-2 flex-shrink-0" />
                    <span>Поиск по номеру маршрута или остановке</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Circle" size={8} className="mt-2 flex-shrink-0" />
                    <span>Сохранение избранных маршрутов</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Bus" size={24} className="text-blue-600" />
                  Типы транспорта
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500 p-2 rounded-lg text-white">
                      <Icon name="Bus" size={20} />
                    </div>
                    <div>
                      <p className="font-semibold">Автобусы</p>
                      <p className="text-sm text-muted-foreground">Основной вид транспорта</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-green-500 p-2 rounded-lg text-white">
                      <Icon name="Zap" size={20} />
                    </div>
                    <div>
                      <p className="font-semibold">Троллейбусы</p>
                      <p className="text-sm text-muted-foreground">Электрический транспорт</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-500 p-2 rounded-lg text-white">
                      <Icon name="Train" size={20} />
                    </div>
                    <div>
                      <p className="font-semibold">Трамваи</p>
                      <p className="text-sm text-muted-foreground">Рельсовый транспорт</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Mail" size={24} />
                Контакты
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Icon name="Phone" size={20} className="text-primary" />
                <span>+7 (495) 123-45-67</span>
              </div>
              <div className="flex items-center gap-3">
                <Icon name="Mail" size={20} className="text-primary" />
                <span>info@transport.city</span>
              </div>
              <div className="flex items-center gap-3">
                <Icon name="MapPin" size={20} className="text-primary" />
                <span>г. Москва, ул. Транспортная, д. 1</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default About;

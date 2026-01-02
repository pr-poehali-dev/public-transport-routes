import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { Link } from 'react-router-dom';

interface Stop {
  id: string;
  name: string;
  x: number;
  y: number;
  labelPosition: 'top' | 'bottom' | 'left' | 'right';
  isTerminal: boolean;
  routes: string[];
}

interface Route {
  id: string;
  number: string;
  type: 'bus' | 'trolleybus' | 'tram';
  color: string;
  lineWidth: number;
  stops: string[];
  path: { x: number; y: number }[];
}

const Editor = () => {
  const [routes, setRoutes] = useState<Route[]>([
    {
      id: '1',
      number: '120',
      type: 'bus',
      color: '#2196F3',
      lineWidth: 4,
      stops: ['001', '002', '003'],
      path: [{ x: 100, y: 100 }, { x: 200, y: 150 }, { x: 300, y: 100 }]
    },
    {
      id: '2',
      number: '34',
      type: 'trolleybus',
      color: '#4CAF50',
      lineWidth: 3,
      stops: ['001', '004', '005'],
      path: [{ x: 100, y: 100 }, { x: 150, y: 200 }, { x: 200, y: 300 }]
    }
  ]);

  const [stops, setStops] = useState<Stop[]>([
    { id: '001', name: 'Метро Университет', x: 100, y: 100, labelPosition: 'top', isTerminal: true, routes: ['1', '2'] },
    { id: '002', name: 'Ул. Строителей', x: 200, y: 150, labelPosition: 'right', isTerminal: false, routes: ['1'] },
    { id: '003', name: 'Метро Проспект Вернадского', x: 300, y: 100, labelPosition: 'top', isTerminal: true, routes: ['1'] },
    { id: '004', name: 'Библиотека', x: 150, y: 200, labelPosition: 'left', isTerminal: false, routes: ['2'] },
    { id: '005', name: 'Торговый центр', x: 200, y: 300, labelPosition: 'bottom', isTerminal: true, routes: ['2'] }
  ]);

  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [selectedStop, setSelectedStop] = useState<string | null>(null);
  const [draggedStop, setDraggedStop] = useState<string | null>(null);
  const [schemaScale, setSchemaScale] = useState(1.5);
  const [isEditingPath, setIsEditingPath] = useState(false);
  const [alignmentMode, setAlignmentMode] = useState(false);
  const [selectedStopsForAlignment, setSelectedStopsForAlignment] = useState<string[]>([]);

  const getNextStopId = () => {
    const maxId = stops.reduce((max, stop) => {
      const num = parseInt(stop.id);
      return num > max ? num : max;
    }, 0);
    return String(maxId + 1).padStart(3, '0');
  };

  const addRoute = () => {
    const newRoute: Route = {
      id: String(routes.length + 1),
      number: '',
      type: 'bus',
      color: '#2196F3',
      lineWidth: 3,
      stops: [],
      path: []
    };
    setRoutes([...routes, newRoute]);
    setSelectedRoute(newRoute.id);
  };

  const addStop = () => {
    const newStop: Stop = {
      id: getNextStopId(),
      name: '',
      x: 200,
      y: 200,
      labelPosition: 'top',
      isTerminal: false,
      routes: []
    };
    setStops([...stops, newStop]);
    setSelectedStop(newStop.id);
  };

  const updateRoute = (id: string, updates: Partial<Route>) => {
    setRoutes(routes.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const updateStop = (id: string, updates: Partial<Stop>) => {
    setStops(stops.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteRoute = (id: string) => {
    setRoutes(routes.filter(r => r.id !== id));
    if (selectedRoute === id) setSelectedRoute(null);
  };

  const deleteStop = (id: string) => {
    setStops(stops.filter(s => s.id !== id));
    if (selectedStop === id) setSelectedStop(null);
  };

  const handleStopDrag = (e: React.MouseEvent<SVGCircleElement>, stopId: string) => {
    e.preventDefault();
    setDraggedStop(stopId);
    
    const svg = e.currentTarget.ownerSVGElement;
    if (!svg) return;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const rect = svg.getBoundingClientRect();
      const x = (moveEvent.clientX - rect.left) / schemaScale;
      const y = (moveEvent.clientY - rect.top) / schemaScale;
      updateStop(stopId, { x, y });
    };

    const handleMouseUp = () => {
      setDraggedStop(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const toggleStopForAlignment = (stopId: string) => {
    if (selectedStopsForAlignment.includes(stopId)) {
      setSelectedStopsForAlignment(selectedStopsForAlignment.filter(id => id !== stopId));
    } else {
      setSelectedStopsForAlignment([...selectedStopsForAlignment, stopId]);
    }
  };

  const alignStops = (axis: 'horizontal' | 'vertical') => {
    if (selectedStopsForAlignment.length < 2) return;
    
    const stopsToAlign = stops.filter(s => selectedStopsForAlignment.includes(s.id));
    
    if (axis === 'horizontal') {
      const avgY = stopsToAlign.reduce((sum, s) => sum + s.y, 0) / stopsToAlign.length;
      stopsToAlign.forEach(stop => updateStop(stop.id, { y: avgY }));
    } else {
      const avgX = stopsToAlign.reduce((sum, s) => sum + s.x, 0) / stopsToAlign.length;
      stopsToAlign.forEach(stop => updateStop(stop.id, { x: avgX }));
    }
    
    setSelectedStopsForAlignment([]);
    setAlignmentMode(false);
  };

  const selectedRouteData = routes.find(r => r.id === selectedRoute);
  const selectedStopData = stops.find(s => s.id === selectedStop);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Icon name="Bus" size={28} />
              <h1 className="text-xl font-bold">Редактор схемы</h1>
            </Link>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary/90" asChild>
                <Link to="/">
                  <Icon name="Home" size={18} className="mr-1" />
                  Главная
                </Link>
              </Button>
              <Button variant="secondary" size="sm">
                <Icon name="Save" size={18} className="mr-1" />
                Сохранить
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Panel - Controls */}
        <div className="w-96 border-r bg-card overflow-y-auto">
          <Tabs defaultValue="routes" className="w-full">
            <TabsList className="w-full grid grid-cols-2 rounded-none border-b">
              <TabsTrigger value="routes" className="rounded-none">
                <Icon name="Route" size={18} className="mr-2" />
                Маршруты
              </TabsTrigger>
              <TabsTrigger value="stops" className="rounded-none">
                <Icon name="MapPin" size={18} className="mr-2" />
                Остановки
              </TabsTrigger>
            </TabsList>

            {/* Routes Tab */}
            <TabsContent value="routes" className="p-4 space-y-4 m-0">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">Список маршрутов</h3>
                <Button size="sm" onClick={addRoute}>
                  <Icon name="Plus" size={16} className="mr-1" />
                  Добавить
                </Button>
              </div>

              <div className="space-y-2">
                {routes.map(route => (
                  <Card
                    key={route.id}
                    className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                      selectedRoute === route.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedRoute(route.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: route.color }}
                        >
                          {route.number || '?'}
                        </div>
                        <div>
                          <div className="font-semibold">{route.number || 'Без номера'}</div>
                          <Badge variant="secondary" className="mt-1">
                            {route.type === 'bus' ? '🚌 Автобус' : route.type === 'trolleybus' ? '⚡ Троллейбус' : '🚋 Трамвай'}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteRoute(route.id);
                        }}
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              {selectedRouteData && (
                <Card className="p-4 space-y-4 animate-fade-in">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h4 className="font-semibold">Редактирование маршрута</h4>
                    <Button
                      size="sm"
                      variant={isEditingPath ? "default" : "outline"}
                      onClick={() => setIsEditingPath(!isEditingPath)}
                    >
                      <Icon name="Pencil" size={14} className="mr-1" />
                      {isEditingPath ? 'Сохранить линию' : 'Редактор линии'}
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label>Номер маршрута</Label>
                      <Input
                        value={selectedRouteData.number}
                        onChange={(e) => updateRoute(selectedRouteData.id, { number: e.target.value })}
                        placeholder="120"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Тип транспорта</Label>
                      <Select
                        value={selectedRouteData.type}
                        onValueChange={(value: 'bus' | 'trolleybus' | 'tram') =>
                          updateRoute(selectedRouteData.id, { type: value })
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bus">🚌 Автобус</SelectItem>
                          <SelectItem value="trolleybus">⚡ Троллейбус</SelectItem>
                          <SelectItem value="tram">🚋 Трамвай</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Цвет линии</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          type="color"
                          value={selectedRouteData.color}
                          onChange={(e) => updateRoute(selectedRouteData.id, { color: e.target.value })}
                          className="w-20 h-10 cursor-pointer"
                        />
                        <Input
                          value={selectedRouteData.color}
                          onChange={(e) => updateRoute(selectedRouteData.id, { color: e.target.value })}
                          placeholder="#2196F3"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Ширина линии: {selectedRouteData.lineWidth}px</Label>
                      <Input
                        type="range"
                        min="1"
                        max="10"
                        value={selectedRouteData.lineWidth}
                        onChange={(e) => updateRoute(selectedRouteData.id, { lineWidth: parseInt(e.target.value) })}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>Остановки маршрута ({selectedRouteData.stops.length})</Label>
                      <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                        {selectedRouteData.stops.map((stopId, index) => {
                          const stop = stops.find(s => s.id === stopId);
                          return (
                            <div key={stopId} className="flex items-center gap-2 text-sm p-2 bg-muted rounded">
                              <span className="font-mono text-xs text-muted-foreground">{index + 1}.</span>
                              <span className="flex-1">{stop?.name || `Остановка ${stopId}`}</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  updateRoute(selectedRouteData.id, {
                                    stops: selectedRouteData.stops.filter(id => id !== stopId)
                                  })
                                }
                              >
                                <Icon name="X" size={14} />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </TabsContent>

            {/* Stops Tab */}
            <TabsContent value="stops" className="p-4 space-y-4 m-0">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">Список остановок</h3>
                <Button size="sm" onClick={addStop}>
                  <Icon name="Plus" size={16} className="mr-1" />
                  Добавить
                </Button>
              </div>

              <div className="space-y-2">
                {stops.map(stop => (
                  <Card
                    key={stop.id}
                    className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                      selectedStop === stop.id ? 'ring-2 ring-primary' : ''
                    } ${
                      alignmentMode && selectedStopsForAlignment.includes(stop.id) ? 'ring-2 ring-orange-500' : ''
                    }`}
                    onClick={() => {
                      if (alignmentMode) {
                        toggleStopForAlignment(stop.id);
                      } else {
                        setSelectedStop(stop.id);
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex flex-col items-center">
                          <Badge variant="outline" className="font-mono text-xs">
                            {stop.id}
                          </Badge>
                          {stop.isTerminal && (
                            <Badge variant="destructive" className="text-xs mt-1">
                              Конечная
                            </Badge>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-sm">{stop.name || 'Без названия'}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Маршруты: {stop.routes.join(', ') || 'нет'}
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteStop(stop.id);
                        }}
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              {selectedStopData && !alignmentMode && (
                <Card className="p-4 space-y-4 animate-fade-in">
                  <h4 className="font-semibold border-b pb-2">Редактирование остановки</h4>

                  <div className="space-y-3">
                    <div>
                      <Label>ID остановки</Label>
                      <Input value={selectedStopData.id} disabled className="mt-1 font-mono" />
                    </div>

                    <div>
                      <Label>Название</Label>
                      <Input
                        value={selectedStopData.name}
                        onChange={(e) => updateStop(selectedStopData.id, { name: e.target.value })}
                        placeholder="Метро Университет"
                        className="mt-1"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Конечная остановка</Label>
                      <Switch
                        checked={selectedStopData.isTerminal}
                        onCheckedChange={(checked) => updateStop(selectedStopData.id, { isTerminal: checked })}
                      />
                    </div>

                    <div>
                      <Label>Позиция названия</Label>
                      <Select
                        value={selectedStopData.labelPosition}
                        onValueChange={(value: 'top' | 'bottom' | 'left' | 'right') =>
                          updateStop(selectedStopData.id, { labelPosition: value })
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="top">⬆️ Сверху</SelectItem>
                          <SelectItem value="bottom">⬇️ Снизу</SelectItem>
                          <SelectItem value="left">⬅️ Слева</SelectItem>
                          <SelectItem value="right">➡️ Справа</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Координаты</Label>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <div>
                          <Label className="text-xs text-muted-foreground">X</Label>
                          <Input
                            type="number"
                            value={Math.round(selectedStopData.x)}
                            onChange={(e) => updateStop(selectedStopData.id, { x: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Y</Label>
                          <Input
                            type="number"
                            value={Math.round(selectedStopData.y)}
                            onChange={(e) => updateStop(selectedStopData.id, { y: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Привязка к маршрутам</Label>
                      <div className="mt-2 space-y-2">
                        {routes.map(route => (
                          <div key={route.id} className="flex items-center gap-2">
                            <Switch
                              checked={selectedStopData.routes.includes(route.id)}
                              onCheckedChange={(checked) => {
                                const newRoutes = checked
                                  ? [...selectedStopData.routes, route.id]
                                  : selectedStopData.routes.filter(id => id !== route.id);
                                updateStop(selectedStopData.id, { routes: newRoutes });
                                
                                if (checked && !route.stops.includes(selectedStopData.id)) {
                                  updateRoute(route.id, { stops: [...route.stops, selectedStopData.id] });
                                } else if (!checked) {
                                  updateRoute(route.id, { stops: route.stops.filter(id => id !== selectedStopData.id) });
                                }
                              }}
                            />
                            <div
                              className="w-8 h-8 rounded flex items-center justify-center text-white text-xs font-bold"
                              style={{ backgroundColor: route.color }}
                            >
                              {route.number}
                            </div>
                            <span className="text-sm">{route.number}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Инструменты выравнивания</h4>
                <div className="space-y-2">
                  <Button
                    variant={alignmentMode ? "default" : "outline"}
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setAlignmentMode(!alignmentMode);
                      setSelectedStopsForAlignment([]);
                    }}
                  >
                    <Icon name="AlignHorizontalJustifyCenter" size={16} className="mr-2" />
                    {alignmentMode ? 'Отменить выбор' : 'Режим выравнивания'}
                  </Button>

                  {alignmentMode && selectedStopsForAlignment.length >= 2 && (
                    <div className="flex gap-2 animate-fade-in">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="flex-1"
                        onClick={() => alignStops('horizontal')}
                      >
                        <Icon name="AlignHorizontalJustifyCenter" size={16} className="mr-1" />
                        По горизонтали
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="flex-1"
                        onClick={() => alignStops('vertical')}
                      >
                        <Icon name="AlignVerticalJustifyCenter" size={16} className="mr-1" />
                        По вертикали
                      </Button>
                    </div>
                  )}

                  {alignmentMode && (
                    <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                      {selectedStopsForAlignment.length === 0
                        ? 'Выберите минимум 2 остановки для выравнивания'
                        : `Выбрано остановок: ${selectedStopsForAlignment.length}`}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel - Schema */}
        <div className="flex-1 bg-muted/30 overflow-hidden relative">
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <Card className="p-2 flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSchemaScale(Math.max(0.5, schemaScale - 0.25))}
              >
                <Icon name="ZoomOut" size={16} />
              </Button>
              <span className="text-sm font-mono px-2">{Math.round(schemaScale * 100)}%</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSchemaScale(Math.min(3, schemaScale + 0.25))}
              >
                <Icon name="ZoomIn" size={16} />
              </Button>
            </Card>
          </div>

          <div className="w-full h-full overflow-auto p-8">
            <svg
              width={800 * schemaScale}
              height={800 * schemaScale}
              className="bg-white rounded-lg shadow-lg"
              style={{ minWidth: '100%', minHeight: '100%' }}
            >
              {/* Grid */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="#e0e0e0"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Routes Lines */}
              {routes.map(route => {
                const routeStops = route.stops
                  .map(stopId => stops.find(s => s.id === stopId))
                  .filter(Boolean) as Stop[];

                if (routeStops.length < 2) return null;

                return (
                  <g key={route.id}>
                    <path
                      d={routeStops
                        .map((stop, i) => `${i === 0 ? 'M' : 'L'} ${stop.x * schemaScale} ${stop.y * schemaScale}`)
                        .join(' ')}
                      stroke={route.color}
                      strokeWidth={route.lineWidth * schemaScale}
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity={selectedRoute === route.id ? 1 : 0.4}
                      className="transition-opacity"
                    />
                  </g>
                );
              })}

              {/* Stops */}
              {stops.map(stop => {
                const isSelected = selectedStop === stop.id;
                const isAlignmentSelected = selectedStopsForAlignment.includes(stop.id);
                const stopRadius = 8 * schemaScale;
                
                let labelX = stop.x * schemaScale;
                let labelY = stop.y * schemaScale;
                let textAnchor: 'start' | 'middle' | 'end' = 'middle';

                switch (stop.labelPosition) {
                  case 'top':
                    labelY -= stopRadius + 5;
                    break;
                  case 'bottom':
                    labelY += stopRadius + 15;
                    break;
                  case 'left':
                    labelX -= stopRadius + 5;
                    textAnchor = 'end';
                    labelY += 5;
                    break;
                  case 'right':
                    labelX += stopRadius + 5;
                    textAnchor = 'start';
                    labelY += 5;
                    break;
                }

                return (
                  <g key={stop.id}>
                    {/* Stop circle */}
                    <circle
                      cx={stop.x * schemaScale}
                      cy={stop.y * schemaScale}
                      r={stopRadius}
                      fill="white"
                      stroke={isAlignmentSelected ? '#FF5722' : isSelected ? '#2196F3' : '#666'}
                      strokeWidth={isAlignmentSelected || isSelected ? 3 * schemaScale : 2 * schemaScale}
                      className="cursor-move transition-all hover:r-10"
                      onMouseDown={(e) => handleStopDrag(e, stop.id)}
                      onClick={() => !draggedStop && setSelectedStop(stop.id)}
                    />

                    {/* Terminal marker */}
                    {stop.isTerminal && (
                      <circle
                        cx={stop.x * schemaScale}
                        cy={stop.y * schemaScale}
                        r={stopRadius * 0.5}
                        fill="#FF5722"
                      />
                    )}

                    {/* Label */}
                    <text
                      x={labelX}
                      y={labelY}
                      textAnchor={textAnchor}
                      fontSize={12 * schemaScale}
                      fontWeight="600"
                      fill="#333"
                      className="pointer-events-none select-none"
                    >
                      {stop.name || stop.id}
                    </text>

                    {/* ID badge */}
                    <text
                      x={stop.x * schemaScale}
                      y={stop.y * schemaScale + stopRadius + 20}
                      textAnchor="middle"
                      fontSize={9 * schemaScale}
                      fill="#999"
                      className="pointer-events-none select-none font-mono"
                    >
                      {stop.id}
                    </text>
                  </g>
                );
              })}

              {/* Editing mode overlay */}
              {isEditingPath && selectedRouteData && (
                <text
                  x="50%"
                  y="30"
                  textAnchor="middle"
                  fontSize={16 * schemaScale}
                  fill="#2196F3"
                  fontWeight="bold"
                >
                  Режим редактирования линии маршрута {selectedRouteData.number}
                </text>
              )}
            </svg>
          </div>

          {isEditingPath && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-fade-in">
              <Card className="p-3 bg-primary text-primary-foreground">
                <div className="flex items-center gap-2">
                  <Icon name="Info" size={18} />
                  <span className="text-sm font-medium">
                    Перетаскивайте остановки для изменения линии маршрута
                  </span>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Editor;

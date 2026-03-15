import { Button, Col, Empty, Input, Row, Select, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { getBuildings, getRooms } from '../../api/rooms';
import RoomCard from '../../components/room/RoomCard';
import type { Building, Room } from '../../types';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';



export default function RoomsPage() {
  
  // set rooms, buildings, search, buildingFilter, capacityFilter
  const [rooms, setRooms] = useState<Room[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [search, setSearch] = useState('');
  const [buildingFilter, setBuildingFilter] = useState<number | undefined>();
  const [capacityFilter, setCapacityFilter] = useState<number | undefined>();

  // get the data from the api when the page render first time
  useEffect(() => {
    void (async () => {
      const [roomData, buildingData] = await Promise.all([getRooms(), getBuildings()]);
      setRooms(roomData);
      setBuildings(buildingData);
    })();
  }, []);


  // using useMemo to filter the rooms to improve the performance
  const filtered = useMemo(() => {
    // filter the rooms
    return rooms.filter((room) => {

      // check if the room matches the search query
      const matchesSearch = [room.name, room.location, room.building?.name]
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase());

      // check if the room matches the building and capacity filters
      const matchesBuilding = !buildingFilter || room.building?.id === buildingFilter;
      // check if the room matches the capacity filter
      const matchesCapacity = !capacityFilter || room.capacity >= capacityFilter;

      // return true if the room matches all filters
      return matchesSearch && matchesBuilding && matchesCapacity;
    });
  }, [rooms, search, buildingFilter, capacityFilter]); // use rooms, search, buildingFilter, capacityFilter as dependencies


  const hasFilters = Boolean(search || buildingFilter || capacityFilter);

  const activeFilterCount = [search, buildingFilter, capacityFilter].filter(Boolean).length;
  const availableRoomsCount = rooms.filter((room) => room.is_active).length;



  return (
    <>
      <div className="rooms-page">

        {/* Display the page hero */}
        <div className="rooms-hero">
          <div className="rooms-hero__content">
            <Typography.Text className="rooms-hero__eyebrow">
              Find your next study spot
            </Typography.Text>

            <Typography.Title level={2} className="rooms-hero__title">
              Browse Rooms
            </Typography.Title>

            <Typography.Paragraph className="rooms-hero__copy">
              Compare rooms by location, building, capacity, and available equipment before opening the detail page.
            </Typography.Paragraph>

            <div className="rooms-hero__pills">
              <span className="rooms-hero__pill">{availableRoomsCount} active rooms</span>
              <span className="rooms-hero__pill">{buildings.length} buildings</span>
              <span className="rooms-hero__pill">
                {activeFilterCount ? `${activeFilterCount} filters active` : 'No filters applied'}
              </span>
            </div>
          </div>

          <div className="rooms-hero__aside">
            <div className="rooms-hero__panel">
              <Typography.Text className="rooms-hero__panel-label">
                Current results
              </Typography.Text>

              <Typography.Title level={3} className="rooms-hero__panel-value">
                {filtered.length}
              </Typography.Title>

              <Typography.Paragraph className="rooms-hero__panel-copy">
                room{filtered.length === 1 ? '' : 's'} match your current search and filter settings.
              </Typography.Paragraph>
            </div>
          </div>
        </div>


        {/* Display the filter toolbar */}
        <div className="rooms-toolbar">

          <div className="rooms-toolbar__controls">

            {/* Search bar */}
            <Input
              allowClear
              value={search}
              prefix={<SearchOutlined />}
              placeholder="Search by room name, location or building"
              style={{ width: 320 }}
              className="rooms-search"
              onChange={(e) => setSearch(e.target.value)}
            />


            {/* Filter by building */}
            <Select
              allowClear
              value={buildingFilter}
              placeholder="Filter by building"
              style={{ width: 220 }}
              options={buildings.map((item) => ({ label: item.name, value: item.id }))}
              onChange={setBuildingFilter}
            />

            {/* Filter by capacity */}
            <Select
              allowClear
              value={capacityFilter}
              placeholder="Minimum capacity"
              style={{ width: 180 }}
              options={[4, 6, 8, 10, 12].map((value) => ({ label: `${value}+`, value }))}
              onChange={setCapacityFilter}
            />

          </div>

          <div className="rooms-toolbar__meta">
            <Typography.Text className="rooms-results">
              {filtered.length} room{filtered.length === 1 ? '' : 's'} found
            </Typography.Text>

            {hasFilters ? (
              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  setSearch('');
                  setBuildingFilter(undefined);
                  setCapacityFilter(undefined);
                }}
              >
                Clear filters
              </Button>
            ) : null}
          </div>

        </div>

        {/* Display the filtered rooms */}
        {filtered.length ? (
          <Row gutter={[20, 20]}>
            {filtered.map((room) => (
              <Col xs={24} md={12} xl={8} key={room.id}>
                <RoomCard room={room} />
              </Col>
            ))}
          </Row>
        ) : (
          <div className="rooms-empty">
            <Empty description="No rooms match your current filters" />
          </div>
        )}

      </div>
    </>
  );

}

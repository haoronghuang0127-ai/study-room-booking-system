import { Col, Empty, Input, Row, Select, Space, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { getBuildings, getRooms } from '../../api/rooms';
import RoomCard from '../../components/room/RoomCard';
import type { Building, Room } from '../../types';

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

  return (
    <>

      {/* Display the title and description */}
      <Typography.Title level={2}>Browse Rooms</Typography.Title>
      <Typography.Paragraph>
        Search rooms by name, location, building, or capacity.
      </Typography.Paragraph>

      {/* Display the search bar, filter by building, and filter by capacity */}
      <Space wrap style={{ marginBottom: 24 }}>
        
        {/* Search bar */}
        <Input.Search
          allowClear
          placeholder="Search by room name, location or building"
          style={{ width: 320 }}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Filter by building */}
        <Select
          allowClear
          placeholder="Filter by building"
          style={{ width: 220 }}
          options={buildings.map((item) => ({ label: item.name, value: item.id }))}
          onChange={setBuildingFilter}
        />

        {/* Filter by capacity */}
        <Select
          allowClear
          placeholder="Minimum capacity"
          style={{ width: 180 }}
          options={[4, 6, 8, 10, 12].map((value) => ({ label: `${value}+`, value }))}
          onChange={setCapacityFilter}
        />
      </Space>

      {/* Display the filtered rooms */}
      {filtered.length ? (
        <Row gutter={[16, 16]}>
          {filtered.map((room) => (
            <Col xs={24} md={12} xl={8} key={room.id}>
              <RoomCard room={room} />
            </Col>
          ))}
        </Row>
      ) : (
        <Empty description="No rooms found" />
      )}
    </>
  );
}

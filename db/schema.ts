import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const routes = sqliteTable('routes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  clientName: text('client_name').notNull(),
  showingDate: text('showing_date').notNull(),
  status: text('status').notNull().default('pending'),
});

export const propertyStops = sqliteTable('property_stops', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  routeId: integer('route_id')
    .notNull()
    .references(() => routes.id, { onDelete: 'cascade' }),
  crmListingUrl: text('crm_listing_url'),
  address: text('address').notNull(),
  visitOrder: integer('visit_order').notNull(),
  estimatedArrival: text('estimated_arrival'),
  isVisited: integer('is_visited', { mode: 'boolean' }).notNull().default(false),
  privateBrokerNotes: text('private_broker_notes'),
  coBrokerName: text('co_broker_name'),
  gpsCoordinates: text('gps_coordinates'),
});

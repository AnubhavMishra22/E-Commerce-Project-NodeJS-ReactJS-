# MySQL Initialization Scripts

These SQL scripts run automatically when the MySQL container starts **for the first time**.

## Execution Order

Scripts are executed in alphabetical order:

1. **01-init-database.sql** - Database setup and permissions
   - Grants privileges to the database user
   - Ensures proper configuration

## Important Notes

### Tables Creation
- **Sequelize ORM** automatically creates all tables when the backend starts
- Tables created: `users`, `products`, `orders`, `orderitems`, `sessions`
- Schemas defined in `backend/models/` directory

### Product Seeding
- Products are seeded by `backend/seeders/seedProducts.js`
- Runs automatically on backend startup
- Only seeds if products table is empty

### When Scripts Run
- These scripts run **ONLY** on first container startup
- If MySQL data volume already exists, scripts are skipped
- To re-run: Delete the volume and recreate container

## Manual Re-execution

To manually re-run initialization:

```bash
# Stop and remove containers with volumes
docker-compose down -v

# Start fresh
docker-compose up -d
```

## Database Schema

The backend uses Sequelize ORM to define:

- **Users**: Authentication and user data
- **Products**: Product catalog
- **Orders**: Customer orders
- **OrderItems**: Individual items in orders
- **Sessions**: Express session storage

All tables are created automatically by Sequelize sync on backend startup.

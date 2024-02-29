---
outline: deep
---
# APIKey
Developers use an API Key to create a [Session](Session) via the Rest API and perform other functions that require validation.

## Filters

| Prop      | Queryable | Qualifier | Range |
| ---       | ---       | ---       | ---   |
| createdAt | No        | No        | Yes   |
| updatedAt | No        | No        | Yes   |
| name      | Yes       | No        | No    |

## Relationships

| Name      | Record                    | Type      | Endpoint              |
| ---       | ---                       | ---       | ---                   |
| user      | [User](User)   | Parent    | /api/apikey/:id/user  |

## Endpoints

### List

```
GET /api/apikey
```

### Create
```
POST /api/apikey
```

### Read
```
GET /api/apikey/:id
```

### Update
```
PUT /api/apikey/:id
```

### Delete
```
DELETE /api/apikey/:id
```

### Options
```
GET /api/apikey/options
```
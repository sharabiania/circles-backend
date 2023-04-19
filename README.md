# Start Local Env
```
npm run dev
```

# Deploy to Prod
```
npx sst deploy --stage prod
```

# Create Test Users
- in Cognito create a user in the user pool.
- use the command below to change the temp password and update status:
```
aws cognito-idp admin-set-user-password \
  --user-pool-id <your-user-pool-id> \
  --username <username> \
  --password <password> \
  --permanent
  ```

  example: 
  ```
  aws cognito-idp admin-set-user-password --user-pool-id us-east-1_nX0eguley --username sharabiani --password MyCoolPassword1! --permanent
  ```
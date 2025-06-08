# ChainChallenge

## Test Suite Documentation

Our test suite is located in `client/src/components/__tests__/` and includes the following test files:

### CreateChallenge.test.tsx
Tests the challenge creation functionality with comprehensive form testing:
- Form field validations (name, description, rules)
- Category and verification method selection via dropdowns
- Date range validation
- Cryptocurrency type and entry fee handling
- Image URL validation
- API interaction verification
- Context updates after successful creation

### JoinChallenge.test.tsx
Tests the challenge participation features:
- Wallet connection verification
- Challenge joining process
- Entry fee validation
- Participant list updates
- Mock wallet integration testing

### LeaderboardDisplay.test.tsx
Tests the leaderboard functionality:
- Participant ranking display
- Score calculations
- Trophy icons for top positions
- Dynamic updates of challenge standings
- Filtering and sorting capabilities

### WalletContext.test.tsx
Tests the wallet integration:
- Connection/disconnection flows
- Balance updates and display
- Address validation
- Error state handling
- Currency conversion utilities

## Running Tests

There are multiple ways to run the tests:

```bash
# Run tests in watch mode (terminal)
npx vitest

# Run tests with UI interface
npx vitest --ui
```

### Vitest UI

The Vitest UI interface (`npx vitest --ui`) provides:
- Real-time test results
- Visual test coverage analysis
- Test file navigation
- Detailed error reporting
- Hot reloading of tests
- Filter and search capabilities

## Test Environment

- Testing Framework: Vitest
- Testing Library: React Testing Library
- Environment: jsdom
- Mocking Utility: vi

## Directory Structure

```
client/
└── src/
    └── components/
        └── __tests__/
            ├── CreateChallenge.test.tsx
            ├── JoinChallenge.test.tsx
            ├── LeaderboardDisplay.test.tsx
            └── WalletContext.test.tsx
```

## Contributing

When adding new features:
1. Write tests in the `__tests__` directory
2. Ensure all tests pass using `npx vitest`
3. Verify coverage remains high
4. Use the UI interface for detailed debugging

## License

MIT

# Contributing Guide

## Getting Started

1. Fork the repository
2. Clone your fork
3. Create a feature branch
4. Make your changes
5. Submit a pull request

## Code Style

### JavaScript/Node.js
- Use ES6+ features
- Use semicolons
- Use 2-space indentation
- Use camelCase for variables and functions
- Use PascalCase for classes and models
- Add comments for complex logic

### Example:
```javascript
const calculateTotal = (items) => {
  // Calculate subtotal
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  
  // Apply tax (10%)
  const tax = subtotal * 0.1;
  
  return subtotal + tax;
};
```

## Naming Conventions

- **Files**: kebab-case (e.g., `user-controller.js`)
- **Functions**: camelCase (e.g., `getUserProfile()`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRIES`)
- **Classes**: PascalCase (e.g., `UserModel`)
- **Variables**: camelCase (e.g., `userData`)

## Commit Messages

Use clear, descriptive commit messages:

```
[TYPE] Brief description

Optional detailed description if needed.

Issue: #123
```

**Types**:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (no logic changes)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Build, dependencies, etc.

**Examples**:
```
feat: Add product filtering by price range
fix: Resolve cart calculation bug
docs: Update API documentation
refactor: Simplify authentication middleware
```

## Pull Request Process

1. **Before submitting**:
   - Ensure code follows style guidelines
   - Test your changes locally
   - Update documentation if needed
   - Add comments for complex logic

2. **PR Description**:
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [x] Bug fix
   - [ ] New feature
   - [ ] Breaking change

   ## Related Issues
   Fixes #123

   ## Testing
   How to test the changes:
   - Step 1
   - Step 2

   ## Screenshots
   (if applicable)
   ```

3. **Review process**:
   - Code review by maintainers
   - Address feedback
   - Request re-review if needed
   - Merge after approval

## Testing

### Manual Testing Checklist

For new features:
- [ ] Feature works as intended
- [ ] No console errors
- [ ] No performance issues
- [ ] Works on different screen sizes
- [ ] Works with different browsers

For bug fixes:
- [ ] Bug is resolved
- [ ] No new bugs introduced
- [ ] Existing features still work
- [ ] Edge cases handled

### API Testing

Test API endpoints using cURL or Postman:

```bash
# Test endpoint
curl -X GET http://localhost:5000/api/health

# With authentication
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer {token}"
```

## Documentation

### Code Comments
Add comments for:
- Complex logic
- Non-obvious solutions
- Important business rules
- Why something is done (not what)

```javascript
// Apply exponential backoff for retry logic
const delay = initialDelay * Math.pow(2, retryCount);
```

### Documentation Files
- `README.md` - Project overview
- `API_DOCUMENTATION.md` - API endpoints
- `CONTRIBUTING.md` - This file
- Inline comments in code

## Issue Reporting

When reporting bugs:

```markdown
## Bug Report

**Description**: Clear description of the bug

**Steps to Reproduce**:
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior**: What should happen

**Actual Behavior**: What actually happens

**Environment**:
- Browser: Chrome 120
- OS: Windows 10
- Node: 18.0.0

**Screenshots**: (if applicable)
```

## Feature Requests

```markdown
## Feature Request

**Title**: Clear title

**Description**: Detailed description

**Use Case**: Why this feature is needed

**Proposed Solution**: How to implement it

**Alternatives**: Other approaches
```

## Development Workflow

### Setting Up Development Environment

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your local settings
# Start development server
npm run dev
```

### Creating a Feature Branch

```bash
# Update main
git checkout main
git pull origin main

# Create feature branch
git checkout -b feat/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: Add your feature"

# Push to your fork
git push origin feat/your-feature-name
```

### Keeping Fork Updated

```bash
# Add upstream
git remote add upstream https://github.com/alhananamal8-crypto/car-store-ecommerce.git

# Fetch updates
git fetch upstream

# Rebase your branch
git rebase upstream/main

# Force push if needed
git push -f origin your-branch-name
```

## Performance Guidelines

- Minimize database queries
- Use indexes for frequently queried fields
- Implement pagination for large datasets
- Cache frequently accessed data
- Optimize images before uploading
- Minimize frontend bundle size
- Use lazy loading for heavy components

## Security Guidelines

- Never commit sensitive data (keys, passwords)
- Validate and sanitize all user inputs
- Use prepared statements for database queries
- Hash passwords with bcryptjs
- Use HTTPS in production
- Implement CORS properly
- Keep dependencies updated
- Regular security audits

## Database Migrations

For schema changes:

1. Create migration file
2. Implement up/down migrations
3. Test thoroughly
4. Document changes
5. Include in PR description

## Version Management

Follow Semantic Versioning (MAJOR.MINOR.PATCH):
- `MAJOR`: Breaking changes
- `MINOR`: New features (backward compatible)
- `PATCH`: Bug fixes

Example: v1.2.3

## Resources

- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [JavaScript Style Guide](https://airbnb.io/javascript/)

## Questions?

- Open an issue
- Check existing documentation
- Ask in discussions
- Email: support@carstore.com

---

Thank you for contributing! 🎉

# Quality Gates Configuration

Quality Gates are predefined thresholds that determine whether a project passes or fails code quality checks.

## Default Quality Gate

### Conditions

| Metric | Operator | Value | Type |
|--------|----------|-------|------|
| Coverage | is less than | 80% | On New Code |
| Duplicated Lines (%) | is greater than | 3% | On New Code |
| Maintainability Rating | is worse than | A | On New Code |
| Reliability Rating | is worse than | A | On New Code |
| Security Rating | is worse than | A | On New Code |
| Security Hotspots Reviewed | is less than | 100% | On New Code |

## Custom Quality Gate: QuantumCart Standard

### New Code Conditions

```json
{
  "name": "QuantumCart Standard",
  "conditions": [
    {
      "metric": "new_coverage",
      "op": "LT",
      "error": "80"
    },
    {
      "metric": "new_duplicated_lines_density",
      "op": "GT",
      "error": "3"
    },
    {
      "metric": "new_maintainability_rating",
      "op": "GT",
      "error": "1"
    },
    {
      "metric": "new_reliability_rating",
      "op": "GT",
      "error": "1"
    },
    {
      "metric": "new_security_rating",
      "op": "GT",
      "error": "1"
    },
    {
      "metric": "new_security_hotspots_reviewed",
      "op": "LT",
      "error": "100"
    },
    {
      "metric": "new_blocker_violations",
      "op": "GT",
      "error": "0"
    },
    {
      "metric": "new_critical_violations",
      "op": "GT",
      "error": "0"
    }
  ]
}
```

### Overall Code Conditions

```json
{
  "conditions": [
    {
      "metric": "coverage",
      "op": "LT",
      "error": "75"
    },
    {
      "metric": "duplicated_lines_density",
      "op": "GT",
      "error": "5"
    },
    {
      "metric": "sqale_rating",
      "op": "GT",
      "error": "1"
    },
    {
      "metric": "reliability_rating",
      "op": "GT",
      "error": "1"
    },
    {
      "metric": "security_rating",
      "op": "GT",
      "error": "1"
    },
    {
      "metric": "blocker_violations",
      "op": "GT",
      "error": "0"
    }
  ]
}
```

## Rating System

### Maintainability Rating (Technical Debt Ratio)

- **A**: ≤ 5% of development time
- **B**: 6-10% of development time
- **C**: 11-20% of development time
- **D**: 21-50% of development time
- **E**: > 50% of development time

### Reliability Rating (Bug Density)

- **A**: 0 bugs
- **B**: At least 1 Minor bug
- **C**: At least 1 Major bug
- **D**: At least 1 Critical bug
- **E**: At least 1 Blocker bug

### Security Rating (Vulnerability Density)

- **A**: 0 vulnerabilities
- **B**: At least 1 Minor vulnerability
- **C**: At least 1 Major vulnerability
- **D**: At least 1 Critical vulnerability
- **E**: At least 1 Blocker vulnerability

## Applying Quality Gates

### Via SonarQube UI

1. Login to SonarQube
2. Go to **Quality Gates**
3. Click **Create**
4. Add conditions
5. Set as default or assign to projects

### Via API

```bash
# Create quality gate
curl -u $SONAR_TOKEN: -X POST \
  'http://localhost:9000/api/qualitygates/create?name=QuantumCart+Standard'

# Add condition
curl -u $SONAR_TOKEN: -X POST \
  'http://localhost:9000/api/qualitygates/create_condition' \
  -d 'gateId=1&metric=new_coverage&op=LT&error=80'

# Set as default
curl -u $SONAR_TOKEN: -X POST \
  'http://localhost:9000/api/qualitygates/set_as_default?id=1'
```

## Breaking Build on Quality Gate Failure

### In Scripts

```bash
# Wait for quality gate result
sonar-scanner -Dsonar.qualitygate.wait=true

# Check exit code
if [ $? -ne 0 ]; then
  echo "Quality gate failed!"
  exit 1
fi
```

### In CI/CD

```yaml
- name: SonarQube Analysis
  run: sonar-scanner -Dsonar.qualitygate.wait=true

- name: Quality Gate Check
  run: |
    STATUS=$(curl -u $SONAR_TOKEN: \
      'http://localhost:9000/api/qualitygates/project_status?projectKey=quantumcart-ecommerce')

    if echo $STATUS | grep -q '"status":"ERROR"'; then
      echo "Quality gate failed"
      exit 1
    fi
```

## Project-Specific Gates

### Backend Gate (Stricter)

```json
{
  "name": "Backend Strict",
  "conditions": [
    {
      "metric": "new_coverage",
      "op": "LT",
      "error": "85"
    },
    {
      "metric": "new_security_rating",
      "op": "GT",
      "error": "1"
    },
    {
      "metric": "new_blocker_violations",
      "op": "GT",
      "error": "0"
    },
    {
      "metric": "new_critical_violations",
      "op": "GT",
      "error": "0"
    }
  ]
}
```

### Frontend Gate (React-Focused)

```json
{
  "name": "Frontend React",
  "conditions": [
    {
      "metric": "new_coverage",
      "op": "LT",
      "error": "75"
    },
    {
      "metric": "new_code_smells",
      "op": "GT",
      "error": "5"
    },
    {
      "metric": "new_security_hotspots_reviewed",
      "op": "LT",
      "error": "100"
    }
  ]
}
```

## Metrics Glossary

| Metric | Description |
|--------|-------------|
| `new_coverage` | Code coverage on new code |
| `coverage` | Overall code coverage |
| `new_duplicated_lines_density` | % of duplicated lines in new code |
| `duplicated_lines_density` | % of overall duplicated lines |
| `new_maintainability_rating` | Maintainability rating for new code |
| `sqale_rating` | Overall maintainability rating |
| `new_reliability_rating` | Reliability rating for new code |
| `reliability_rating` | Overall reliability rating |
| `new_security_rating` | Security rating for new code |
| `security_rating` | Overall security rating |
| `new_blocker_violations` | Blocker issues in new code |
| `blocker_violations` | Overall blocker issues |
| `new_critical_violations` | Critical issues in new code |
| `critical_violations` | Overall critical issues |
| `new_security_hotspots_reviewed` | % of reviewed security hotspots in new code |

## Best Practices

### 1. Start Lenient, Get Stricter

- Begin with achievable thresholds
- Gradually increase requirements
- Track improvement over time

### 2. Different Gates for Different Contexts

- Stricter for production branches
- More lenient for feature branches
- Security-focused for sensitive modules

### 3. Focus on New Code

- Harder to fix legacy code
- Prevent new technical debt
- Gradual overall improvement

### 4. Monitor Trends

- Track metrics over time
- Set improvement goals
- Celebrate achievements

### 5. Review and Adjust

- Quarterly gate reviews
- Team feedback
- Industry benchmarks

## Exemptions and Exceptions

### When to Adjust Gates

- Legacy code migration
- Prototype/proof-of-concept
- Time-sensitive hotfixes
- External libraries

### How to Handle Exceptions

1. Document reason
2. Create technical debt ticket
3. Set remediation timeline
4. Review in retrospective

## Resources

- [SonarQube Quality Gates](https://docs.sonarqube.org/latest/user-guide/quality-gates/)
- [Metric Definitions](https://docs.sonarqube.org/latest/user-guide/metric-definitions/)
- [Clean as You Code](https://docs.sonarqube.org/latest/user-guide/clean-as-you-code/)

---

**Remember:** Quality gates are tools to help maintain standards, not obstacles. Adjust them to your team's needs and improve gradually.

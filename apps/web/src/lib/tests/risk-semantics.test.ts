import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getSeverityFromScore, formatRiskScore } from '../risk-semantics';

describe('Risk Semantics & Threshold Mapping', () => {
  it('correctly maps scores to LOW severity', () => {
    assert.equal(getSeverityFromScore(0.0), 'LOW');
    assert.equal(getSeverityFromScore(0.15), 'LOW');
    assert.equal(getSeverityFromScore(0.29), 'LOW');
  });

  it('correctly maps scores to MODERATE severity', () => {
    assert.equal(getSeverityFromScore(0.30), 'MODERATE');
    assert.equal(getSeverityFromScore(0.45), 'MODERATE');
    assert.equal(getSeverityFromScore(0.59), 'MODERATE');
  });

  it('correctly maps scores to HIGH severity', () => {
    assert.equal(getSeverityFromScore(0.60), 'HIGH');
    assert.equal(getSeverityFromScore(0.70), 'HIGH');
    assert.equal(getSeverityFromScore(0.79), 'HIGH');
  });

  it('correctly maps scores to CRITICAL severity', () => {
    assert.equal(getSeverityFromScore(0.80), 'CRITICAL');
    assert.equal(getSeverityFromScore(0.84), 'CRITICAL');
    assert.equal(getSeverityFromScore(1.0), 'CRITICAL');
  });

  it('clamps out-of-bounds scores', () => {
    assert.equal(getSeverityFromScore(-0.5), 'LOW');
    assert.equal(getSeverityFromScore(1.5), 'CRITICAL');
  });

  it('formats risk scores accurately as decimals and percentages', () => {
    assert.equal(formatRiskScore(0.842), '0.84');
    assert.equal(formatRiskScore(0.842, 'percentage'), '84%');
  });
});

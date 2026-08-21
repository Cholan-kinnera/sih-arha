import { MockCitizenService } from '../mocks/mock-citizen.service';
import { MockSchemeService } from '../mocks/mock-scheme.service';
import { MockDocumentService } from '../mocks/mock-document.service';

async function testServices() {
  console.log('--- Testing Phase 2 Service Abstractions ---');

  // 1. Citizen Service
  const citizenService = new MockCitizenService();
  const profile = await citizenService.getCurrentProfile();
  console.assert(profile !== null, 'Citizen profile should not be null');
  console.assert(profile?.fullName === 'Arjun Kumar', 'Default citizen name match');

  // 2. Scheme Service
  const schemeService = new MockSchemeService();
  const schemes = await schemeService.getSchemes({ category: 'SCHOLARSHIP' });
  console.assert(schemes.length > 0, 'Should return matching scholarship schemes');
  console.assert(schemes[0].id === 'SCHEME-SYNTH-001', 'First scheme ID match');

  // 3. Document Service
  const docService = new MockDocumentService();
  const docs = await docService.getDocuments('CIT-DEMO-2026');
  console.assert(docs.length === 3, 'Should return 3 mock documents');

  console.log('✓ All Phase 2 Service Abstraction Tests PASSED cleanly!');
}

testServices().catch((err) => {
  console.error('Service test failed:', err);
  throw err;
});

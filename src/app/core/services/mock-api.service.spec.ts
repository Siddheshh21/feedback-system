import { TestBed } from '@angular/core/testing';
import { MockApiService } from './mock-api.service';
import { Feedback } from '../models/feedback.model';

describe('MockApiService', () => {
  let service: MockApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockApiService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create and retrieve feedback', (done) => {
    const newFeedback: Omit<Feedback, 'id' | 'createdAt' | 'updatedAt'> = {
      title: 'Test Feedback',
      description: 'This is a test description for unit testing.',
      category: 'bug',
      status: 'new',
      userId: 'test-user',
      userName: 'Test User'
    };

    service.createFeedback(newFeedback).subscribe(created => {
      expect(created.title).toBe(newFeedback.title);
      expect(created.id).toBeTruthy();
      
      service.getFeedbacks().subscribe(list => {
        expect(list.some(f => f.id === created.id)).toBeTrue();
        done();
      });
    });
  });

  it('should update feedback status', (done) => {
    service.createFeedback({
      title: 'To Update',
      description: 'Description here long enough',
      category: 'other',
      status: 'new',
      userId: 'u1',
      userName: 'User 1'
    }).subscribe(created => {
      service.updateFeedback(created.id, { status: 'resolved' }).subscribe(updated => {
        expect(updated.status).toBe('resolved');
        done();
      });
    });
  });
});

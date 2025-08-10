import { WorkOrderPart } from '../domain/work-order-part.value-object';

describe('WorkOrderPart', () => {
  const validProps = {
    partId: '123e4567-e89b-12d3-a456-426614174000',
    partName: 'Brake Pad',
    partDescription: 'Front brake pads for sedans',
    partNumber: 'BP-001',
    quantity: 2,
    unitPrice: 150.00,
    notes: 'Replace both front brake pads',
  };

  describe('constructor', () => {
    it('should create a work order part with valid properties', () => {
      const part = new WorkOrderPart(
        validProps.partId,
        validProps.partName,
        validProps.partDescription,
        validProps.partNumber,
        validProps.quantity,
        validProps.unitPrice,
        validProps.notes,
      );

      expect(part.partId).toBe(validProps.partId);
      expect(part.partName).toBe(validProps.partName);
      expect(part.partDescription).toBe(validProps.partDescription);
      expect(part.partNumber).toBe(validProps.partNumber);
      expect(part.quantity).toBe(validProps.quantity);
      expect(part.unitPrice).toBe(validProps.unitPrice);
      expect(part.notes).toBe(validProps.notes);
      expect(part.isApproved).toBe(false);
      expect(part.appliedAt).toBeUndefined();
    });

    it('should throw error when quantity is zero or negative', () => {
      expect(() => new WorkOrderPart(
        validProps.partId,
        validProps.partName,
        validProps.partDescription,
        validProps.partNumber,
        0,
        validProps.unitPrice,
      )).toThrow('Quantity must be greater than zero');

      expect(() => new WorkOrderPart(
        validProps.partId,
        validProps.partName,
        validProps.partDescription,
        validProps.partNumber,
        -1,
        validProps.unitPrice,
      )).toThrow('Quantity must be greater than zero');
    });

    it('should throw error when unit price is negative', () => {
      expect(() => new WorkOrderPart(
        validProps.partId,
        validProps.partName,
        validProps.partDescription,
        validProps.partNumber,
        validProps.quantity,
        -1,
      )).toThrow('Unit price cannot be negative');
    });
  });

  describe('totalPrice', () => {
    it('should calculate total price correctly', () => {
      const part = new WorkOrderPart(
        validProps.partId,
        validProps.partName,
        validProps.partDescription,
        validProps.partNumber,
        validProps.quantity,
        validProps.unitPrice,
      );

      expect(part.totalPrice).toBe(300.00); // 2 * 150.00
    });
  });

  describe('updateQuantity', () => {
    it('should return new instance with updated quantity', () => {
      const originalPart = new WorkOrderPart(
        validProps.partId,
        validProps.partName,
        validProps.partDescription,
        validProps.partNumber,
        validProps.quantity,
        validProps.unitPrice,
      );

      const updatedPart = originalPart.updateQuantity(5);

      expect(updatedPart.quantity).toBe(5);
      expect(updatedPart.totalPrice).toBe(750.00); // 5 * 150.00
      expect(originalPart.quantity).toBe(2); // Original should remain unchanged
    });
  });

  describe('updateUnitPrice', () => {
    it('should return new instance with updated unit price', () => {
      const originalPart = new WorkOrderPart(
        validProps.partId,
        validProps.partName,
        validProps.partDescription,
        validProps.partNumber,
        validProps.quantity,
        validProps.unitPrice,
      );

      const updatedPart = originalPart.updateUnitPrice(200.00);

      expect(updatedPart.unitPrice).toBe(200.00);
      expect(updatedPart.totalPrice).toBe(400.00); // 2 * 200.00
      expect(originalPart.unitPrice).toBe(150.00); // Original should remain unchanged
    });
  });

  describe('approve', () => {
    it('should return new instance with approved status', () => {
      const originalPart = new WorkOrderPart(
        validProps.partId,
        validProps.partName,
        validProps.partDescription,
        validProps.partNumber,
        validProps.quantity,
        validProps.unitPrice,
      );

      const approvedPart = originalPart.approve();

      expect(approvedPart.isApproved).toBe(true);
      expect(originalPart.isApproved).toBe(false); // Original should remain unchanged
    });
  });

  describe('markAsApplied', () => {
    it('should return new instance with applied timestamp', () => {
      const originalPart = new WorkOrderPart(
        validProps.partId,
        validProps.partName,
        validProps.partDescription,
        validProps.partNumber,
        validProps.quantity,
        validProps.unitPrice,
      );

      const appliedPart = originalPart.markAsApplied();

      expect(appliedPart.appliedAt).toBeInstanceOf(Date);
      expect(originalPart.appliedAt).toBeUndefined(); // Original should remain unchanged
    });
  });
});

import { render, screen, fireEvent } from '@testing-library/react';
import { DIDRegistration } from '../../src/components/DIDRegistration';

describe('DIDRegistration', () => {
    it('should render initial step', () => {
        render(<DIDRegistration />);
        expect(screen.getByTestId('step-indicator')).toBeInTheDocument();
        expect(screen.getByTestId('basic-info')).toBeInTheDocument();
    });

    it('should progress through steps', () => {
        render(<DIDRegistration />);
        
        // Initial state
        expect(screen.getByTestId('basic-info')).toBeInTheDocument();
        
        // Move to step 2
        fireEvent.click(screen.getByTestId('next-button'));
        expect(screen.getByTestId('kyc-upload')).toBeInTheDocument();
        
        // Move to step 3
        fireEvent.click(screen.getByTestId('next-button'));
        expect(screen.getByTestId('did-confirmation')).toBeInTheDocument();
        
        // Move back to step 2
        fireEvent.click(screen.getByTestId('back-button'));
        expect(screen.getByTestId('kyc-upload')).toBeInTheDocument();
    });
}); 
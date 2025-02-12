import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DocumentUpload } from '../../src/components/DocumentUpload';

describe('DocumentUpload', () => {
    it('should render dropzone', () => {
        render(<DocumentUpload />);
        expect(screen.getByTestId('dropzone')).toBeInTheDocument();
    });

    it('should handle file uploads', () => {
        render(<DocumentUpload />);
        
        const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
        const dropzone = screen.getByTestId('dropzone');

        fireEvent.drop(dropzone, {
            dataTransfer: {
                files: [file]
            }
        });

        expect(screen.getByTestId('document-preview')).toBeInTheDocument();
        expect(screen.getByTestId('upload-progress')).toBeInTheDocument();
    });
}); 
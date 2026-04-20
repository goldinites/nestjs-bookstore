export enum BookErrors {
  NOT_FOUND = 'Book not found',
  NOT_CREATED = 'Book not created',
  NOT_UPDATED = 'Book not updated',
  NOT_DELETED = 'Book not deleted',
  IMAGE_REQUIRED = 'Image is required',
}

export enum ReviewErrors {
  NOT_FOUND = 'Review not found',
  NOT_UPDATED = 'Review not updated',
  ALREADY_EXISTS = 'You already reviewed this book',
}

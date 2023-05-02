export interface Book {
    id: number,
    title: string,
    author: string,
    resume: string,
    image: string,
    url: string,
    userRegister: string,
    category: number[],
    categoriesDescription?: string | undefined,
    public: boolean,
    isbn13: number,
    price: string
  }
  
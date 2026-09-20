class Category {
  constructor(id, title, color) {
    this.id = id;
    this.title = title;
    // Historical field name — value is an image URL used by browse tiles.
    this.color = color;
    this.imageUrl = color;
  }
}

export default Category;

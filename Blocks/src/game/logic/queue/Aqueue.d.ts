declare namespace ASC {
    const NUM_PREVIEWS = 6;
    abstract class AQueue {
        abstract getQueue(): Piece[];
        abstract getNext(): Piece;
        abstract hasNext(): boolean;
    }
}

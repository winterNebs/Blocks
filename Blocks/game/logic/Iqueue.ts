namespace ASC {
    export const NUM_PREVIEWS = 6;
    export abstract class IQueue {
        public abstract getQueue(): Piece[];
        public abstract getNext(): Piece;
        public abstract hasNext(): boolean;
    }
}
//stack data structure
trait Stack<T> {
    fn push(&mut self, item: T);
    fn pop(&mut self) -> Option<T>;
    fn peek(&self) -> Option<&T>;
    fn is_empty(&self) -> bool;
}

fn main() {
    println!("Hello, world!");
}

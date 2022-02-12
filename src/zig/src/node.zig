const Allocator = @import("std").mem.Allocator;

pub const Node = extern struct {
    left: ?*Node,
    right: ?*Node,
    symbol: u8,
    frequency: u32,
};

pub fn nodeCreate(alloc: Allocator, symbol: u8, frequency: u32) !*Node {
    const n = try alloc.create(Node);
    n.left = null;
    n.right = null;
    n.symbol = symbol;
    n.frequency = frequency;
    return n;
}

pub fn nodeJoin(alloc: Allocator, left: *Node, right: *Node) !*Node {
    const n = try nodeCreate(alloc, '$', left.frequency + right.frequency);
    n.left = left;
    n.right = right;
    return n;
}

pub fn nodeCompare(a: *const Node, b: *const Node) i8 {
    if (a.frequency > b.frequency) {
        return 1;
    } else if (a.frequency < b.frequency) {
        return -1;
    } else {
        return 0;
    }
}

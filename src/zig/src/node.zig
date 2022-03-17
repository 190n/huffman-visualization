const std = @import("std");
const Allocator = std.mem.Allocator;
const Order = std.math.Order;

pub const Node = extern struct {
    left: ?*Node,
    right: ?*Node,
    symbol: u8,
    frequency: u32,
};

pub fn nodeCreate(alloc: Allocator, symbol: u8, frequency: u32) !*Node {
    const n = try alloc.create(Node);
    n.* = .{
        .left = null,
        .right = null,
        .symbol = symbol,
        .frequency = frequency,
    };
    return n;
}

pub fn nodeJoin(alloc: Allocator, left: *Node, right: *Node) !*Node {
    const n = try nodeCreate(alloc, '$', left.frequency + right.frequency);
    n.left = left;
    n.right = right;
    return n;
}

pub fn nodeCompare(a: *const Node, b: *const Node) Order {
    return std.math.order(a.frequency, b.frequency);
}

const expect = std.testing.expect;

test "nodeJoin" {
    const a = try nodeCreate(std.testing.allocator, 'a', 5);
    defer std.testing.allocator.destroy(a);
    const b = try nodeCreate(std.testing.allocator, 'b', 6);
    defer std.testing.allocator.destroy(b);
    const joined = try nodeJoin(std.testing.allocator, a, b);
    defer std.testing.allocator.destroy(joined);

    try expect(std.meta.eql(a.*, .{
        .left = null,
        .right = null,
        .symbol = 'a',
        .frequency = 5,
    }));
    try expect(std.meta.eql(b.*, .{
        .left = null,
        .right = null,
        .symbol = 'b',
        .frequency = 6,
    }));
    try expect(std.meta.eql(joined.*, .{
        .left = a,
        .right = b,
        .symbol = '$',
        .frequency = 11,
    }));
}

test "nodeCompare" {
    const a = try nodeCreate(std.testing.allocator, 'a', 5);
    defer std.testing.allocator.destroy(a);
    const b = try nodeCreate(std.testing.allocator, 'b', 6);
    defer std.testing.allocator.destroy(b);

    try expect(nodeCompare(a, b) == .lt);
    try expect(nodeCompare(b, a) == .gt);
    try expect(nodeCompare(a, a) == .eq);
    try expect(nodeCompare(b, b) == .eq);
}

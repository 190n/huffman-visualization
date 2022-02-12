const std = @import("std");
const node = @import("./node.zig");
const Node = node.Node;
const PriorityQueue = @import("./pq.zig").PriorityQueue;

var buf: [65536]u8 = undefined;
var fba = std.heap.FixedBufferAllocator.init(&buf);
const fbaAlloc = fba.allocator();

extern fn saveTreeSnapshot(items: [*]*Node, size: usize) void;

export fn buildTree(hist: [*]u8) ?*Node {
    const q = PriorityQueue(*Node, node.nodeCompare).init(fbaAlloc, 256) catch return null;
    defer q.deinit();

    var c: u16 = 0;
    while (c < 256) : (c += 1) {
        if (hist[c] > 0) {
            // enqueue a node for this character
            const n = node.nodeCreate(fbaAlloc, @intCast(u8, c), hist[c]) catch return null;
            q.enqueue(n) catch unreachable;
        }
    }

    saveTreeSnapshot(q.items.ptr, q.size());

    while (q.size() >= 2) {
        // dequeue 2 nodes
        var left = q.dequeue().?;
        var right = q.dequeue().?;
        // join them
        var joined = node.nodeJoin(fbaAlloc, left, right) catch unreachable;
        // enqueue the joined one
        q.enqueue(joined) catch unreachable;
        saveTreeSnapshot(q.items.ptr, q.size());
    }

    // get the sole node
    var root = q.dequeue().?;
    return root;
}

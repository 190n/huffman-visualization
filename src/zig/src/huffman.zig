const std = @import("std");
const node = @import("./node.zig");
const PriorityQueue = std.PriorityQueue;

var buf: [65536]u8 = undefined;
var fba = std.heap.FixedBufferAllocator.init(&buf);
const fbaAlloc = fba.allocator();

// imported from wasm environment
extern fn saveTreeSnapshot(items: [*]*node.Node, size: usize) void;

export fn buildTree(hist: [*]u32) ?*node.Node {
    var q = PriorityQueue(*node.Node, void, node.nodeCompare).init(fbaAlloc, {});
    defer q.deinit();

    var c: u16 = 0;
    while (c < 256) : (c += 1) {
        if (hist[c] > 0) {
            // enqueue a node for this character
            const n = node.nodeCreate(fbaAlloc, @intCast(u8, c), hist[c]) catch return null;
            q.add(n) catch unreachable;
        }
    }

    saveTreeSnapshot(q.items.ptr, q.count());

    while (q.count() >= 2) {
        // dequeue 2 nodes
        var left = q.remove();
        var right = q.remove();
        // join them
        var joined = node.nodeJoin(fbaAlloc, left, right) catch unreachable;
        // enqueue the joined one
        q.add(joined) catch unreachable;
        saveTreeSnapshot(q.items.ptr, q.count());
    }

    // get the sole node
    var root = q.remove();
    return root;
}

export const histogram: [256]u32 = undefined;

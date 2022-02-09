const std = @import("std");
const Allocator = std.mem.Allocator;
const Node = @cImport(@cInclude("node.h")).Node;

fn PriorityQueue(comptime T: type, comptime cmp: fn (T, T) i8) type {
    return struct {
        capacity: usize,
        tail: usize,
        items: []T,
        allocator: Allocator,

        const Self = @This();

        pub fn init(allocator: Allocator, capacity: usize) !*Self {
            var q: *Self = try allocator.create(Self);
            q.capacity = capacity;
            q.tail = 0;
            q.allocator = allocator;
            if (allocator.alloc(T, capacity)) |items| {
                q.items = items;
            } else |err| {
                allocator.destroy(q);
                return err;
            }
            return q;
        }

        pub fn deinit(self: *Self) void {
            self.allocator.free(self.items);
            self.allocator.destroy(self);
        }

        pub fn empty(self: *const Self) bool {
            return self.tail == 0;
        }

        pub fn full(self: *const Self) bool {
            return self.tail == self.capacity;
        }

        fn minChild(self: *const Self, first: usize, last: usize) usize {
            const left = 2 * first;
            const right = left + 1;
            if (right <= last and cmp(self.items[right - 1], self.items[left - 1]) < 0) {
                return right;
            } else {
                return left;
            }
        }

        fn fixHeap(self: *Self, first: usize, last: usize) void {
            var found = false;
            var parent = first;
            var great = self.minChild(parent, last);

            while (parent <= last / 2 and !found) {
                if (cmp(self.items[parent - 1], self.items[great - 1]) > 0) {
                    std.mem.swap(T, &self.items[parent - 1], &self.items[great - 1]);
                    parent = great;
                    great = self.minChild(parent, last);
                } else {
                    found = true;
                }
            }
        }

        pub fn enqueue(self: *Self, x: T) error{Full}!void {
            if (self.full()) {
                return error.Full;
            } else {
                // insert node at the end
                var current_index = self.tail + 1;
                self.tail += 1;
                self.items[current_index - 1] = x;
                // bubble up
                while (current_index > 1 and cmp(self.items[current_index - 1], self.items[current_index / 2 - 1]) < 0) {
                    std.mem.swap(T, &self.items[current_index - 1], &self.items[current_index / 2 - 1]);
                    current_index /= 2;
                }
            }
        }

        pub fn dequeue(self: *Self) ?T {
            if (self.empty()) {
                return null;
            } else {
                // get root node
                const item = self.items[0];
                // move last node to front
                self.tail -= 1;
                self.items[0] = self.items[self.tail];
                // push it down
                self.fixHeap(1, self.tail);
                // return it
                return item;
            }
        }
    };
}

fn nodeCompare(a: *const Node, b: *const Node) i8 {
    if (a.frequency > b.frequency) {
        return 1;
    } else if (a.frequency < b.frequency) {
        return -1;
    } else {
        return 0;
    }
}

const NodePQ = PriorityQueue(*const Node, nodeCompare);

var buf: [65536]u8 = undefined;
var fba = std.heap.FixedBufferAllocator.init(&buf);
const fbaAlloc = fba.allocator();

const PQCPointer = ?*align(@alignOf(NodePQ)) anyopaque;

fn asPQ(q: PQCPointer) ?*NodePQ {
    if (q) |ptr| {
        return @ptrCast(*NodePQ, ptr);
    } else {
        return null;
    }
}

export fn pq_create(capacity: u32) callconv(.C) PQCPointer {
    return NodePQ.init(fbaAlloc, capacity) catch null;
}

export fn pq_delete(q: *PQCPointer) callconv(.C) void {
    asPQ(q).?.deinit();
    q.* = null;
}

export fn pq_empty(q: PQCPointer) callconv(.C) bool {
    return asPQ(q).?.empty();
}

export fn pq_full(q: PQCPointer) callconv(.C) bool {
    return asPQ(q).?.full();
}

export fn pq_size(q: PQCPointer) callconv(.C) u32 {
    return asPQ(q).?.tail;
}

export fn enqueue(q: PQCPointer, n: *const Node) callconv(.C) bool {
    if (asPQ(q).?.enqueue(n)) |_| {
        return true;
    } else |_| {
        return false;
    }
}

export fn dequeue(q: PQCPointer, n: **const Node) callconv(.C) bool {
    if (asPQ(q).?.dequeue()) |dequeued| {
        n.* = dequeued;
        return true;
    } else {
        return false;
    }
}

export fn pq_items(q: PQCPointer) callconv(.C) [*]*const Node {
    return asPQ(q).?.items[0..].ptr;
}

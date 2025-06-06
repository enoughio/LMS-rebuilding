'use client';

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Library } from '@/types/library';
import toast from 'react-hot-toast';

const Approvals: React.FC = () => {
  const [pendingApprovals, setPendingApprovals] = useState<Library[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedLibrary, setSelectedLibrary] = useState<Library | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // ────────────────────────────────────────────────────────────────────────────────
  // Fetch pending approvals once on mount
  // ────────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const response = await fetch("/api/libraries/approvals", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        if (!response.ok) {
          // Safely grab server‑side error message (if any)
          let errMsg = "Failed to fetch pending approvals";
          try {
            const err = await response.json();
            errMsg = err?.message ?? errMsg;
          } catch (_) {
            /* ignore json parse error */
            console.error("Error parsing error response:", _);  
          }
          toast.error(errMsg);
          setPendingApprovals([]);
          return;
        }

        const { data } = await response.json();
        setPendingApprovals(data.data ?? []);
      } catch (error) {
        toast.error(
          `Network error: ${error instanceof Error ? error : "Something went wrong"}`
        );
        setPendingApprovals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovals();
  }, []);

  // ────────────────────────────────────────────────────────────────────────────────
  // Helpers
  // ────────────────────────────────────────────────────────────────────────────────
  const closeDialog = () => setSelectedLibrary(null);

  const handleAction = async (action: 'approve' | 'reject') => {
    if (!selectedLibrary) return;
    setSubmitting(true);
    try {
      const response = await fetch(`/api/libraries/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedLibrary.id }),
      });

      if (!response.ok) {
        let errMsg = `Failed to ${action} library`;
        try {
          const err = await response.json();
          errMsg = err?.message ?? errMsg;
        } catch (_) {
          /* ignore */
          console.error("Error parsing error response:", _);
        }
        throw new Error(errMsg);
      }

      toast.success(`Library ${action}d successfully!`);
      // Remove library from local state on success
      setPendingApprovals(prev => prev.filter(lib => lib.id !== selectedLibrary.id));
      closeDialog();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to process the action');
      console.error(`Error while trying to ${action}:`, error);
    } finally {
      setSubmitting(false);
    }
  };

  // ────────────────────────────────────────────────────────────────────────────────
  // Render
  // ────────────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* List --------------------------------------------------------------- */}
      <div className="min-w-fit">
        <Card className="w-[5 00px] bg-white border-0 rounded-md ">
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>
              Libraries and admins awaiting approval
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="text-muted-foreground w-full min-h-[300px]">Loading...</div>
              ) : pendingApprovals.length > 0 ? (
                pendingApprovals.map(library => (
                  <div
                    key={library.id}
                    className="flex items-center justify-between bg-[#F6EDE5] rounded-lg  p-4 max-w-[600px]"
                  >
                    <div>
                      <h3 className="font-medium">{library.name}</h3>
                      {library.description && (
                        <p className="text-xs leading-4 py-2">{library.description}</p>
                      )}
                      <p className="text-sm text-muted-foreground">{library.address}</p>
                    </div>
                    <div className="flex gap-2 px-5">
                      <Button className='bg-[#3B82F6] border-0 text-white' size="sm" variant="outline" onClick={() => setSelectedLibrary(library)}>
                        Review
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground flex justify-center items-center w-full min-h-[300px] bg-amber-100/50 p-4 rounded-lg">
                  No pending approvals at the moment.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog ------------------------------------------------------------- */}
      <Dialog open={!!selectedLibrary} onOpenChange={open => !open && closeDialog()}>
        <DialogContent className="overflow-y-auto max-w-[1000px] md:min-w-[800px] max-h-[90vh] bg-white">
          <DialogHeader>
            <DialogTitle>Review Library</DialogTitle>
          </DialogHeader>

          {selectedLibrary && (
            <div className="space-y-4 text-sm">
              {/* Basic Information */}
              <div>
                <h3 className="font-medium text-lg">Basic Details</h3>
                <div className="grid grid-cols-[150px_1fr] gap-2 pt-2">
                  <span className="font-medium">Name</span>
                  <span>{selectedLibrary.name}</span>
                  <span className="font-medium">Description</span>
                  <span>{selectedLibrary.description ?? '—'}</span>
                  <span className="font-medium">Address</span>
                  <span>{selectedLibrary.address}</span>
                  <span className="font-medium">City</span>
                  <span>{selectedLibrary.city}</span>
                  <span className="font-medium">State</span>
                  <span>{selectedLibrary.state}</span>
                  <span className="font-medium">Country</span>
                  <span>{selectedLibrary.country}</span>
                  <span className="font-medium">Postal Code</span>
                  <span>{selectedLibrary.postalCode}</span>
                  <span className="font-medium">Phone</span>
                  <span>{selectedLibrary.phone ?? '—'}</span>
                  <span className="font-medium">Email</span>
                  <span>{selectedLibrary.email ?? '—'}</span>
                  <span className="font-medium">Total Seats</span>
                  <span>{selectedLibrary.totalSeats ?? '—'}</span>
                </div>
              </div>

              {/* Amenities */}
              {Array.isArray(selectedLibrary.amenities) && selectedLibrary.amenities.length > 0 && (
                <div>
                  <h3 className="font-medium text-lg">Amenities</h3>
                  <p className="pt-2">{selectedLibrary.amenities.join(', ')}</p>
                </div>
              )}

              {/* Admin Details */}
              {selectedLibrary.admin && (
                <div>
                  <h3 className="font-medium text-lg">Admin Details</h3>
                  <div className="grid grid-cols-[150px_1fr] gap-2 pt-2">
                    <span className="font-medium">Name</span>
                    <span>{selectedLibrary.admin.name}</span>
                    <span className="font-medium">Email</span>
                    <span>{selectedLibrary.admin.email}</span>
                    <span className="font-medium">Joined On</span>
                    <span>{new Date(selectedLibrary.admin.createdAt).toLocaleDateString()}</span>
                    {selectedLibrary.AdminBio && (
                      <>
                        <span className="font-medium">Bio</span>
                        <span>{selectedLibrary.AdminBio}</span>
                      </>
                    )}
                    {selectedLibrary.AdminPhone && (
                      <>
                        <span className="font-medium">Phone</span>
                        <span>{selectedLibrary.AdminPhone}</span>
                      </>
                    )}
                    {selectedLibrary.admin.role && (
                      <>
                        <span className="font-medium">Role</span>
                        <span>{selectedLibrary.admin.role}</span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex justify-end gap-2 pt-4">
            <Button
              size="sm"
              variant="outline"
              disabled={submitting}
              onClick={() => handleAction('reject')}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Reject
            </Button>
            <Button
              size="sm"
              disabled={submitting}
              onClick={() => handleAction('approve')}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Approvals;
